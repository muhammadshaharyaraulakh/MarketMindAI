<?php

namespace App\Domain\DataIngestion\Services;

use App\Domain\DataIngestion\Contracts\Services\PineconeServiceInterface;
use App\Models\Campaign;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PineconeService implements PineconeServiceInterface
{
    public function generateCampaignSummary(Campaign $campaign): string
    {
        $stats = DB::table('ad_analytics')
            ->where('entity_type', 'campaign')
            ->where('entity_id', $campaign->id)
            ->select(
                DB::raw('SUM(spend) as total_spend'),
                DB::raw('SUM(conversion_value) as total_revenue'),
                DB::raw('SUM(clicks) as total_clicks'),
                DB::raw('SUM(impressions) as total_impressions'),
                DB::raw('SUM(conversions) as total_conversions'),
                DB::raw('MIN(date) as min_date'),
                DB::raw('MAX(date) as max_date')
            )
            ->first();

        $spend = (float) ($stats->total_spend ?? 0);
        $revenue = (float) ($stats->total_revenue ?? 0);
        $roas = $spend > 0 ? round($revenue / $spend, 2) : 0;
        $clicks = (int) ($stats->total_clicks ?? 0);
        $impressions = (int) ($stats->total_impressions ?? 0);
        $conversions = (int) ($stats->total_conversions ?? 0);
        $ctr = $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;
        $dateRange = ($stats->min_date ?? 'N/A') . ' to ' . ($stats->max_date ?? 'N/A');

        return "{$campaign->name} is a {$campaign->platform} campaign with objective {$campaign->objective}. Over {$dateRange}, it spent \${$spend} with a {$roas}x ROAS, {$clicks} clicks, and {$conversions} conversions. Average CTR was {$ctr}%. Status: {$campaign->status}.";
    }

    public function embedText(string $text): array
    {
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            Log::error('GEMINI_API_KEY not set.');
            return [];
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={$apiKey}";

        try {
            $response = Http::post($url, [
                'model' => 'models/gemini-embedding-001',
                'content' => [
                    'parts' => [
                        ['text' => $text]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['embedding']['values'] ?? [];
            } else {
                Log::error('Gemini embedding failed', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Gemini embedding exception', ['message' => $e->getMessage()]);
        }

        return [];
    }

    public function upsertCampaign(Campaign $campaign, int $userId): bool
    {
        $summaryText = $this->generateCampaignSummary($campaign);
        $vector = $this->embedText($summaryText);

        if (empty($vector)) {
            Log::warning("Empty vector generated for campaign {$campaign->id}");
            return false;
        }

        $pineconeHost = env('PINECONE_INDEX_HOST');
        $pineconeKey = env('PINECONE_API_KEY');

        if (!$pineconeHost || !$pineconeKey) {
            Log::error('Pinecone configuration missing.');
            return false;
        }

        $url = rtrim($pineconeHost, '/') . '/vectors/upsert';

        try {
            $response = Http::withHeaders([
                'Api-Key' => $pineconeKey,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'vectors' => [[
                    'id' => "campaign_{$campaign->id}_{$userId}",
                    'values' => $vector,
                    'metadata' => [
                        'campaign_id' => $campaign->id,
                        'user_id' => $userId,
                        'campaign_name' => $campaign->name,
                        'platform' => $campaign->platform,
                        'status' => $campaign->status,
                        'summary' => $summaryText
                    ]
                ]],
                'namespace' => "user_{$userId}"
            ]);

            if ($response->successful()) {
                return true;
            } else {
                Log::error('Pinecone upsert failed', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Pinecone upsert exception', ['message' => $e->getMessage()]);
        }

        return false;
    }

    public function upsertAllCampaigns(array $campaignIds, int $userId): void
    {
        $success = 0;
        $failed = 0;

        foreach ($campaignIds as $id) {
            $campaign = Campaign::find($id);
            if ($campaign) {
                if ($this->upsertCampaign($campaign, $userId)) {
                    $success++;
                } else {
                    $failed++;
                }
            }
        }

        Log::info("Upserted campaigns to Pinecone. Success: {$success}, Failed: {$failed}");
    }

    public function query(string $queryText, int $userId, int $topK = 5): array
    {
        $vector = $this->embedText($queryText);
        if (empty($vector)) {
            return [];
        }

        $pineconeHost = env('PINECONE_INDEX_HOST');
        $pineconeKey = env('PINECONE_API_KEY');

        if (!$pineconeHost || !$pineconeKey) {
            Log::error('Pinecone configuration missing for query.');
            return [];
        }

        $url = rtrim($pineconeHost, '/') . '/query';

        try {
            $response = Http::withHeaders([
                'Api-Key' => $pineconeKey,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'vector' => $vector,
                'topK' => $topK,
                'includeMetadata' => true,
                'namespace' => "user_{$userId}"
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $contexts = [];
                if (isset($data['matches'])) {
                    foreach ($data['matches'] as $match) {
                        if (isset($match['metadata']['summary'])) {
                            $contexts[] = $match['metadata']['summary'];
                        }
                    }
                }
                return $contexts;
            } else {
                Log::error('Pinecone query failed', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Pinecone query exception', ['message' => $e->getMessage()]);
        }

        return [];
    }
}
