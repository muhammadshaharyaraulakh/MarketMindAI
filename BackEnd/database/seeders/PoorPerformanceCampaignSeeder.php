<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AdAccount;
use App\Models\Campaign;
use App\Models\AdSet;
use App\Models\Ad;
use App\Models\AdAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PoorPerformanceCampaignSeeder extends Seeder
{
    public function run()
    {
        $user = User::first(); // Assuming a user exists
        if (!$user) {
            echo "No user found to attach campaigns to.\n";
            return;
        }

        $adAccount = AdAccount::where('user_id', $user->id)->first();
        if (!$adAccount) {
            $adAccount = AdAccount::create([
                'user_id' => $user->id,
                'account_name' => 'Test Account for Alerts',
                'platform' => 'google',
                'platform_account_id' => 'act_test_alerts',
                'currency' => 'USD',
                'timezone' => 'UTC',
                'status' => 'active'
            ]);
        }

        $campaign = Campaign::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'ad_account_id' => $adAccount->id,
            'platform' => 'google',
            'platform_campaign_id' => 'cmp_poor_123',
            'name' => 'Poor Performance - Conversion Drop Test',
            'objective' => 'sales',
            'status' => 'active',
            'budget_type' => 'daily',
            'budget_amount' => 100.00,
            'currency' => 'USD',
            'start_date' => Carbon::now()->subDays(15)->toDateString(),
            'sync_status' => 'synced',
        ]);

        $adSet = AdSet::create([
            'uuid' => (string) Str::uuid(),
            'campaign_id' => $campaign->id,
            'name' => 'Broad Audience - Poor Performance',
            'status' => 'active',
            'budget_amount' => 100.00,
            'budget_type' => 'daily',
            'sync_status' => 'synced',
        ]);

        $ad = Ad::create([
            'ad_set_id' => $adSet->id,
            'name' => 'Failing Creative v1',
            'status' => 'active',
            'review_status' => 'APPROVED',
            'ad_format' => 'image',
            'destination_url' => 'https://marketmind.ai/test',
            'cta_type' => 'LEARN_MORE',
            'sync_status' => 'synced',
        ]);

        \App\Models\AdGoogleDetail::create([
            'ad_id' => $ad->id,
            'headlines' => json_encode(['Failing Headline']),
            'descriptions' => json_encode(['Not generating any clicks']),
        ]);

        $now = Carbon::now();
        $today = $now->toDateString();
        
        // Let's seed AdAnalytic for Campaign directly to trigger alerts easily
        // We need:
        // Prior 7 days (days 4 to 10 ago): HIGH CTR, LOW CPA, HIGH Conversions
        // Recent 3 days (days 0 to 3 ago): LOW CTR, HIGH CPA, LOW Conversions
        
        $metrics = [];
        
        // Baseline (days 4 to 10 ago)
        for ($i = 4; $i <= 10; $i++) {
            $date = $now->copy()->subDays($i)->toDateString();
            $metrics[] = [
                'entity_type' => 'campaign',
                'entity_id' => $campaign->id,
                'date' => $date,
                'spend' => 50,
                'conversion_value' => 200,
                'impressions' => 10000,
                'clicks' => 500, // CTR: 5%
                'conversions' => 10, // CPA: $5
                'ctr' => 5.0,
                'cpc' => 0.1,
                'cpm' => 5.0,
                'roas' => 4.0,
            ];
        }

        // Recent (days 0 to 3 ago) - TRASH Performance
        for ($i = 0; $i <= 3; $i++) {
            $date = $now->copy()->subDays($i)->toDateString();
            
            // To trigger budget_exhaustion, let's make today's spend very high if it's before 12 PM
            // Since we don't know the exact time the job will run, let's just make spend super high on $i=0.
            $spend = ($i == 0) ? 150 : 50; // Exhausted budget today

            $metrics[] = [
                'entity_type' => 'campaign',
                'entity_id' => $campaign->id,
                'date' => $date,
                'spend' => $spend, // High spend
                'conversion_value' => 0, // 0 revenue
                'impressions' => 10000,
                'clicks' => 50, // CTR: 0.5% (Massive drop from 5%)
                'conversions' => 1, // CPA: $50 to $150 (Massive spike from $5)
                'ctr' => 0.5,
                'cpc' => $spend / 50,
                'cpm' => ($spend / 10000) * 1000,
                'roas' => 0.0,
            ];
        }

        foreach ($metrics as $metric) {
            AdAnalytic::create($metric);
            
            // Also seed for the ad and ad set to ensure UI shows it correctly if they drill down
            $adMetric = $metric;
            $adMetric['entity_type'] = 'ad';
            $adMetric['entity_id'] = $ad->id;
            AdAnalytic::create($adMetric);

            $adSetMetric = $metric;
            $adSetMetric['entity_type'] = 'ad_set';
            $adSetMetric['entity_id'] = $adSet->id;
            AdAnalytic::create($adSetMetric);
        }

        echo "Poor Performance Campaign Seeded Successfully!\n";
    }
}
