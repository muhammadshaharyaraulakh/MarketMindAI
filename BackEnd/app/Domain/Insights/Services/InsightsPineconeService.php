<?php

namespace App\App\Domain\Insights\Services;

use App\Models\Alert;
use App\Models\Recommendation;
use App\App\Domain\Insights\Contracts\Services\InsightsPineconeServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InsightsPineconeService implements InsightsPineconeServiceInterface
{
    public function upsertAlert(Alert $alert, Recommendation $recommendation, int $userId): bool
    {
        $summaryText = "On {$alert->triggered_at->toDateString()}, {$alert->campaign_name} ({$alert->platform}) triggered a {$alert->severity} alert: {$alert->title}. {$alert->detail}. Recommended action: {$recommendation->recommendation_text}";

        try {
            $geminiKey = env('GEMINI_API_KEY');
            if (!$geminiKey) throw new \Exception('GEMINI_API_KEY not configured.');

            $pineconeKey = env('PINECONE_API_KEY');
            $pineconeHost = env('PINECONE_INDEX_HOST');

            if (!$pineconeKey || !$pineconeHost) throw new \Exception('Pinecone credentials not configured.');

            // Get embedding
            $embedResponse = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={$geminiKey}", [
                'model' => 'models/gemini-embedding-001',
                'content' => [
                    'parts' => [['text' => $summaryText]]
                ]
            ]);

            if (!$embedResponse->successful()) {
                throw new \Exception('Failed to get Gemini embedding: ' . $embedResponse->body());
            }

            $embedding = $embedResponse->json('embedding.values');

            // Upsert to Pinecone
            $pineconeResponse = Http::withHeaders([
                'Api-Key' => $pineconeKey,
                'Content-Type' => 'application/json'
            ])->post("https://{$pineconeHost}/vectors/upsert", [
                'vectors' => [
                    [
                        'id' => "alert_{$alert->id}_{$userId}",
                        'values' => $embedding,
                        'metadata' => [
                            'alert_id' => $alert->id,
                            'campaign_id' => $alert->campaign_id,
                            'campaign_name' => $alert->campaign_name,
                            'platform' => $alert->platform,
                            'severity' => $alert->severity,
                            'alert_type' => $alert->alert_type,
                            'triggered_at' => $alert->triggered_at->toDateTimeString(),
                            'text' => $summaryText
                        ]
                    ]
                ],
                'namespace' => "user_{$userId}"
            ]);

            if (!$pineconeResponse->successful()) {
                throw new \Exception('Failed to upsert to Pinecone: ' . $pineconeResponse->body());
            }

            return true;

        } catch (\Exception $e) {
            Log::error('InsightsPineconeService Error: ' . $e->getMessage());
            return false;
        }
    }
}
