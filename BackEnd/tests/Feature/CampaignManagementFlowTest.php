<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\AdAccount;

class CampaignManagementFlowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_full_campaign_management_flow()
    {
        // 1. Setup User and Ad Account
        $user = User::factory()->create();
        
        $adAccount = AdAccount::create([
            'user_id' => $user->id,
            'account_name' => 'Test Ad Account',
            'platform' => 'google',
            'platform_account_id' => 'act_test123',
            'currency' => 'USD',
            'timezone' => 'UTC',
            'status' => 'active'
        ]);

        // 2. Create Campaign
        $campaignData = [
            'ad_account_id' => $adAccount->id,
            'name' => 'Test Campaign Flow',
            'objective' => 'sales',
            'platform' => 'google',
            'budget_amount' => 1000,
            'budget_type' => 'daily',
            'start_date' => now()->toDateString(),
        ];

        $response = $this->actingAs($user)->postJson('/api/campaigns', $campaignData);
        $response->assertStatus(201);
        $campaignId = $response->json('data.id');
        $this->assertDatabaseHas('campaigns', ['name' => 'Test Campaign Flow']);

        // 3. Create Ad Set
        $adSetData = [
            'campaign_id' => $campaignId,
            'name' => 'Test Ad Set',
            'optimization_goal' => 'conversions',
            'billing_event' => 'cpc',
            'budget_amount' => 500,
            'audience_type' => 'broad',
            'age_min' => 18,
            'age_max' => 65,
        ];

        $response = $this->actingAs($user)->postJson('/api/adsets', $adSetData);
        $response->assertStatus(201);
        $adSetId = $response->json('data.id');
        $this->assertDatabaseHas('ad_sets', ['name' => 'Test Ad Set']);

        // 4. Create Ad
        $adData = [
            'ad_set_id' => $adSetId,
            'name' => 'Test Ad',
            'ad_format' => 'image',
            'destination_url' => 'https://example.com',
            'cta_type' => 'learn_more',
            // Platform specific
            'headlines' => ['Test Headline 1', 'Test Headline 2'],
            'descriptions' => ['Test Description'],
        ];

        $response = $this->actingAs($user)->postJson('/api/ads', $adData);
        $response->assertStatus(201);
        $adId = $response->json('data.id');
        $this->assertDatabaseHas('ads', ['name' => 'Test Ad']);

        // 5. Add Daily Metrics
        $metricsData = [
            'date' => now()->toDateString(),
            'spend' => 100,
            'revenue' => 250,
            'impressions' => 10000,
            'clicks' => 500,
            'conversions' => 10,
            'leads' => 5
        ];

        $response = $this->actingAs($user)->postJson("/api/ads/{$adId}/metrics", $metricsData);
        $response->assertStatus(200);
        $this->assertDatabaseHas('ad_analytics', [
            'entity_type' => 'ad',
            'entity_id' => $adId,
            'spend' => 100
        ]);

        // 6. Fetch Campaign Details to verify aggregation
        $response = $this->actingAs($user)->getJson("/api/campaigns/{$campaignId}");
        $response->assertStatus(200);
        
        // Assert that the campaign now has the total spend aggregated from the ad
        $response->assertJsonPath('data.campaign.metrics.spend', "100.0000");
        
        // 7. Verify deletion cascade
        $response = $this->actingAs($user)->deleteJson("/api/campaigns/{$campaignId}");
        $response->assertStatus(200);
        
        $this->assertDatabaseMissing('campaigns', ['id' => $campaignId]);
        $this->assertDatabaseMissing('ad_sets', ['id' => $adSetId]);
        $this->assertDatabaseMissing('ads', ['id' => $adId]);
    }
}
