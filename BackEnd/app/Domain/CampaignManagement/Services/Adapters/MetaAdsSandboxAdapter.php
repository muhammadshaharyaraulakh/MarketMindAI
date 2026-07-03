<?php

namespace App\Domain\CampaignManagement\Services\Adapters;

use App\Domain\CampaignManagement\Contracts\Services\AdPlatformAdapterInterface;
use Illuminate\Support\Facades\Log;

class MetaAdsSandboxAdapter implements AdPlatformAdapterInterface
{
    public function createCampaign(array $campaignData, \App\Models\AdAccount $adAccount): array
    {
        $credentials = $adAccount->credentials ?? [];
        $accessToken = $credentials['access_token'] ?? env('META_ACCESS_TOKEN', '');
        $adAccountId = $credentials['ad_account_id'] ?? env('META_AD_ACCOUNT_ID', 'act_123456789');

        // Authentic Meta Graph API v19 JSON Schema for Campaign Creation
        $payload = [
            'name' => $campaignData['name'] ?? 'MarketMind Meta Campaign',
            'objective' => 'OUTCOME_TRAFFIC', // Meta uses Outcome-driven objectives now
            'status' => 'PAUSED',
            'special_ad_categories' => ['NONE'],
            'buying_type' => 'AUCTION',
        ];

        Log::channel('single')->info('Initiating Meta Graph API Request', [
            'endpoint' => "https://graph.facebook.com/v19.0/{$adAccountId}/campaigns",
            'access_token' => $accessToken ? 'PROVIDED' : 'MISSING',
            'payload' => $payload
        ]);

        try {
            // Simulating API Latency (1-3 seconds for realism)
            sleep(rand(1, 3));

            $fakeMetaCampaignId = rand(100000000000000, 999999999999999);

            Log::channel('single')->info('Meta Graph API Response (Simulated 200 OK)', [
                'status' => 200,
                'results' => [
                    'id' => (string) $fakeMetaCampaignId
                ]
            ]);

            return [
                'success' => true,
                'external_id' => (string) $fakeMetaCampaignId,
            ];
            
        } catch (\Exception $e) {
            Log::error('Meta API Error', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'external_id' => null,
            ];
        }
    }
}
