<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Get the latest user or create one
        $user = User::latest()->first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Muhammad Shaharyar Aulakh',
                'email' => 'shaharyar@marketmind.ai',
                'password' => bcrypt('password123'),
            ]);
        }

        // 2. Run the old OverviewDashboardSeeder (healthy campaigns)
        $this->call([
            OverviewDashboardSeeder::class,
        ]);

        // 3. Seed underperforming campaigns directly in DatabaseSeeder
        $this->seedUnderperformingAds($user);

        // 4. Sync Pinecone
        $campaigns = \App\Models\Campaign::pluck('id')->toArray();
        try {
            app(\App\Domain\DataIngestion\Contracts\Services\PineconeServiceInterface::class)
                ->upsertAllCampaigns($campaigns, $user->id);
            $this->command->info('Synced campaigns to Pinecone.');
        } catch (\Exception $e) {
            $this->command->error('Failed to sync to Pinecone: ' . $e->getMessage());
        }

        // 5. Trigger Anomaly Detection to generate Insights
        dispatch(new \App\Jobs\DetectAnomaliesJob($user->id));
        $this->command->info('Dispatched DetectAnomaliesJob to generate insights.');
    }

    private function seedUnderperformingAds(User $user): void
    {
        // Clean up previous demo insights campaigns
        \App\Models\Campaign::where('user_id', $user->id)->where('name', 'like', 'Insights Demo%')->delete();
        \App\Models\Alert::where('user_id', $user->id)->delete();

        // 3 Ad Accounts
        $googleAccount = \App\Models\AdAccount::firstOrCreate(
            ['user_id' => $user->id, 'platform' => 'google'],
            ['account_name' => 'Google Ads Main', 'status' => 'active']
        );
        $metaAccount = \App\Models\AdAccount::firstOrCreate(
            ['user_id' => $user->id, 'platform' => 'meta'],
            ['account_name' => 'Meta Business Main', 'status' => 'active']
        );
        $snapchatAccount = \App\Models\AdAccount::firstOrCreate(
            ['user_id' => $user->id, 'platform' => 'snapchat'],
            ['account_name' => 'Snapchat Ads Main', 'status' => 'active']
        );

        $now = \Illuminate\Support\Carbon::now();
        $today = $now->toDateString();

        // --------------------------------------------------------------------------------
        // Campaign 1: CTR Drop & CPA Spike (Critical)
        // --------------------------------------------------------------------------------
        $campaign1 = \App\Models\Campaign::create([
            'user_id' => $user->id,
            'ad_account_id' => $googleAccount->id,
            'name' => 'Insights Demo: Google Search Underperforming',
            'platform' => 'google',
            'status' => 'active',
            'objective' => 'sales',
            'created_at' => $now->copy()->subMonths(2),
            'updated_at' => now(),
        ]);

        \App\Models\AdSet::create([
            'campaign_id' => $campaign1->id,
            'name' => 'Broad Match Ad Set',
            'status' => 'active',
            'budget_type' => 'daily',
            'budget_amount' => 100
        ]);

        // Seed 10 days of data.
        for ($i = 10; $i > 3; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign1->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'google',
                'spend' => 90,
                'impressions' => 10000,
                'clicks' => 500,  // 5% CTR
                'conversions' => 10,  // $9 CPA
                'conversion_value' => 400
            ]);
        }
        for ($i = 3; $i >= 0; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign1->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'google',
                'spend' => 120,  // Spend went up
                'impressions' => 15000,  // Impressions up
                'clicks' => 150,  // Clicks down! 1% CTR (Critical drop > 40%)
                'conversions' => 2,  // Conversions down! $60 CPA (Critical spike > 50%)
                'conversion_value' => 80
            ]);
        }

        // --------------------------------------------------------------------------------
        // Campaign 2: Conversion Drop (Critical)
        // --------------------------------------------------------------------------------
        $campaign2 = \App\Models\Campaign::create([
            'user_id' => $user->id,
            'ad_account_id' => $metaAccount->id,
            'name' => 'Insights Demo: Meta Retargeting Fatigue',
            'platform' => 'meta',
            'status' => 'active',
            'objective' => 'sales',
            'created_at' => $now->copy()->subMonths(2),
            'updated_at' => now(),
        ]);

        \App\Models\AdSet::create([
            'campaign_id' => $campaign2->id,
            'name' => 'Retargeting Visitors',
            'status' => 'active',
            'budget_type' => 'daily',
            'budget_amount' => 200
        ]);

        for ($i = 10; $i >= 7; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign2->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'meta',
                'spend' => 180,
                'impressions' => 20000,
                'clicks' => 400,
                'conversions' => 50,  // 50/day
                'conversion_value' => 2500
            ]);
        }
        for ($i = 6; $i > 3; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign2->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'meta',
                'spend' => 180,
                'impressions' => 20000,
                'clicks' => 400,
                'conversions' => 30,
                'conversion_value' => 1500
            ]);
        }
        for ($i = 3; $i >= 0; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign2->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'meta',
                'spend' => 180,
                'impressions' => 20000,
                'clicks' => 400,
                'conversions' => 10,  // 10/day (massive drop from 50)
                'conversion_value' => 500
            ]);
        }

        // --------------------------------------------------------------------------------
        // Campaign 3: Spend Pacing / Budget Exhaustion
        // --------------------------------------------------------------------------------
        $campaign3 = \App\Models\Campaign::create([
            'user_id' => $user->id,
            'ad_account_id' => $snapchatAccount->id,
            'name' => 'Insights Demo: Snap Budget Issues',
            'platform' => 'snapchat',
            'status' => 'active',
            'objective' => 'awareness',
            'created_at' => $now->copy()->subMonths(2),
            'updated_at' => now(),
        ]);

        \App\Models\AdSet::create([
            'campaign_id' => $campaign3->id,
            'name' => 'Gen Z Audience',
            'status' => 'active',
            'budget_type' => 'daily',
            'budget_amount' => 50
        ]);

        for ($i = 10; $i > 0; $i--) {
            \App\Models\AdAnalytic::create([
                'entity_type' => 'campaign',
                'entity_id' => $campaign3->id,
                'date' => $now->copy()->subDays($i)->toDateString(),
                'platform' => 'snapchat',
                'spend' => 48,
                'impressions' => 50000,
                'clicks' => 200,
                'conversions' => 5,
                'conversion_value' => 100
            ]);
        }

        $hour = $now->hour;
        $todaySpend = 48;

        if ($hour <= 12) {
            $todaySpend = 55;
        } else {
            $todaySpend = 55;
        }

        \App\Models\AdAnalytic::create([
            'entity_type' => 'campaign',
            'entity_id' => $campaign3->id,
            'date' => $today,
            'platform' => 'snapchat',
            'spend' => $todaySpend,
            'impressions' => 1000,
            'clicks' => 10,
            'conversions' => 0,
            'conversion_value' => 0
        ]);
        
        $this->command->info('Seeded underperforming campaigns into DatabaseSeeder.');
    }
}
