<?php

namespace App\Domain\CampaignManagement\Services\Adapters;

use App\Domain\CampaignManagement\Contracts\Services\AdPlatformAdapterInterface;
use Illuminate\Support\Facades\Log;

class SnapchatAdsSandboxAdapter implements AdPlatformAdapterInterface
{
    public function createCampaign(array $campaignData, \App\Models\AdAccount $adAccount): array
    {
        $credentials = $adAccount->credentials ?? [];
        $accessToken = $credentials['access_token'] ?? env('SNAPCHAT_ACCESS_TOKEN', '');
        $adAccountId = $credentials['ad_account_id'] ?? env('SNAPCHAT_AD_ACCOUNT_ID', '12345678-abcd-efgh-ijkl-1234567890ab');

        // Authentic Snapchat Ads API JSON Schema
        $payload = [
            'campaigns' => [
                [
                    'name' => $campaignData['name'] ?? 'MarketMind Snap Campaign',
                    'ad_account_id' => $adAccountId,
                    'status' => 'PAUSED',
                    'objective' => 'SWIPES', // Snapchat specific objective
                    'daily_budget_micro' => ($campaignData['daily_budget'] ?? 10) * 1000000,
                    'start_time' => now()->toIso8601String(),
                ]
            ]
        ];

        Log::channel('single')->info('Initiating Snapchat Ads API Request', [
            'endpoint' => "https://adsapi-sandbox.snapchat.com/v1/adaccounts/{$adAccountId}/campaigns",
            'access_token' => $accessToken ? 'PROVIDED' : 'MISSING',
            'payload' => $payload
        ]);

        try {
            // Simulating API Latency (1-3 seconds for realism)
            sleep(rand(1, 3));

            $fakeSnapCampaignId = 'ca_' . bin2hex(random_bytes(8));

            Log::channel('single')->info('Snapchat Ads API Response (Simulated 200 OK)', [
                'status' => 200,
                'results' => [
                    'request_status' => 'SUCCESS',
                    'campaigns' => [
                        [
                            'campaign' => [
                                'id' => $fakeSnapCampaignId
                            ]
                        ]
                    ]
                ]
            ]);

            return [
                'success' => true,
                'external_id' => $fakeSnapCampaignId,
            ];
            
        } catch (\Exception $e) {
            Log::error('Snapchat API Error', ['message' => $e->getMessage()]);
            return [
                'success' => false,
                'external_id' => null,
            ];
        }
    }
}
