<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AdAccount;
use App\Models\Campaign;
use App\Models\AdSet;
use App\Models\Ad;
use App\Models\AdAnalytic;
use App\Models\AdGoogleDetail;
use App\Models\AdMetaDetail;
use App\Models\AdSnapchatDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OverviewDashboardSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $this->command->error('No user found to seed data for.');
            return;
        }

        // Clean up previous seeded data (optional, but good for idempotency)
        AdAnalytic::query()->delete();
        AdGoogleDetail::query()->delete();
        AdMetaDetail::query()->delete();
        AdSnapchatDetail::query()->delete();
        Ad::query()->delete();
        AdSet::query()->delete();
        Campaign::query()->delete();
        AdAccount::query()->delete();

        // 3 Ad Accounts
        $googleAccount = AdAccount::updateOrCreate(
            ['user_id' => $user->id, 'platform' => 'google'],
            ['account_name' => 'Google Ads Main', 'status' => 'active']
        );
        $metaAccount = AdAccount::updateOrCreate(
            ['user_id' => $user->id, 'platform' => 'meta'],
            ['account_name' => 'Meta Business Main', 'status' => 'active']
        );
        $snapchatAccount = AdAccount::updateOrCreate(
            ['user_id' => $user->id, 'platform' => 'snapchat'],
            ['account_name' => 'Snapchat Ads Main', 'status' => 'active']
        );

        $now = Carbon::now();
        $startDate = $now->copy()->subDays(59);
        $endDate = $now->copy();

        $campaignConfigs = [
            [
                'platform' => 'google',
                'account' => $googleAccount,
                'name' => 'Summer Search Expansion',
                'objective' => 'sales',
                'status' => 'active',
                'budget_type' => 'daily',
                'base_impressions' => 7500, // Google ~56%
                'ctr_base' => 0.04, // 4%
                'cpc_base' => 1.50,
                'cvr_base' => 0.08,
                'aov_base' => 65.0,
                'ad_format' => 'responsive',
                'ad_sets' => 2,
            ],
            [
                'platform' => 'meta',
                'account' => $metaAccount,
                'name' => 'Retargeting Core Audience',
                'objective' => 'leads',
                'status' => 'active',
                'budget_type' => 'daily',
                'base_impressions' => 15000, // Meta ~28% (cheaper CPC)
                'ctr_base' => 0.02, // 2%
                'cpc_base' => 0.80,
                'cvr_base' => 0.05,
                'aov_base' => 45.0,
                'ad_format' => 'image',
                'ad_sets' => 3,
            ],
            [
                'platform' => 'snapchat',
                'account' => $snapchatAccount,
                'name' => 'GenZ Brand Awareness',
                'objective' => 'awareness',
                'status' => 'active',
                'budget_type' => 'daily',
                'base_impressions' => 22500, // Snap ~15% (very cheap CPC)
                'ctr_base' => 0.01, // 1%
                'cpc_base' => 0.40,
                'cvr_base' => 0.02,
                'aov_base' => 35.0,
                'ad_format' => 'story', // Or story
                'ad_sets' => 2,
            ],
        ];

        DB::beginTransaction();

        try {
            foreach ($campaignConfigs as $cIndex => $config) {
                $campaign = Campaign::create([
                    'uuid' => \Illuminate\Support\Str::uuid(),
                    'user_id' => $user->id,
                    'ad_account_id' => $config['account']->id,
                    'name' => $config['name'],
                    'platform' => $config['platform'],
                    'status' => $config['status'],
                    'objective' => $config['objective'],
                    'budget_amount' => 0, // Placeholder
                    'budget_type' => $config['budget_type'],
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ]);

                $trendMultiplier = 1.0 + ($cIndex * 0.05); // slight initial offset
                
                for ($s = 0; $s < $config['ad_sets']; $s++) {
                    // Uneven split
                    $adSetShare = $s === 0 ? 0.65 : ($s === 1 ? 0.25 : 0.10);
                    
                    $adSet = AdSet::create([
                        'uuid' => \Illuminate\Support\Str::uuid(),
                        'campaign_id' => $campaign->id,
                        'name' => "Ad Set " . ($s + 1) . " - " . ucfirst($config['platform']),
                        'status' => 'active',
                        'optimization_goal' => $config['objective'] === 'sales' ? 'conversions' : ($config['objective'] === 'leads' ? 'leads' : 'impressions'),
                        'budget_amount' => 0, // Placeholder
                    ]);

                    $adsCount = rand(2, 3);
                    for ($a = 0; $a < $adsCount; $a++) {
                        $adShare = 1 / $adsCount; // Split evenly within adset for simplicity, variance handles the rest
                        $adBaselineImp = $config['base_impressions'] * $adSetShare * $adShare;

                        $ad = Ad::create([
                            'uuid' => \Illuminate\Support\Str::uuid(),
                            'ad_set_id' => $adSet->id,
                            'name' => "Ad " . ($a + 1) . " - " . ucfirst($config['platform']),
                            'status' => 'active',
                            'ad_format' => $config['ad_format'],
                            'review_status' => 'approved',
                        ]);

                        if ($config['platform'] === 'google') {
                            AdGoogleDetail::create(['ad_id' => $ad->id, 'headlines' => json_encode(['Top Quality', 'Buy Now']), 'descriptions' => json_encode(['Best in class products']), 'business_name' => 'Acme Corp']);
                        } elseif ($config['platform'] === 'meta') {
                            AdMetaDetail::create(['ad_id' => $ad->id, 'primary_text' => 'Check this out!', 'link_description' => 'Limited time offer']);
                        } elseif ($config['platform'] === 'snapchat') {
                            AdSnapchatDetail::create(['ad_id' => $ad->id, 'brand_name' => 'Our Brand', 'headline' => 'Swipe up now', 'call_to_action' => 'SHOP_NOW']);
                        }

                        // Generate 60 days of data
                        $currentTrend = 1.0;
                        for ($d = 0; $d < 60; $d++) {
                            $date = $startDate->copy()->addDays($d);
                            $isWeekend = $date->isWeekend();
                            
                            $dayOfWeekFactor = $isWeekend ? 0.85 : 1.15; // Weekdays higher
                            // slight upward or downward trend
                            $currentTrend += ($config['platform'] === 'google' ? 0.005 : -0.002);
                            $noise = rand(85, 115) / 100.0;

                            $impressions = (int) round($adBaselineImp * $dayOfWeekFactor * $currentTrend * $noise);
                            $ctrNoise = rand(90, 110) / 100.0;
                            $ctr = $config['ctr_base'] * $ctrNoise;
                            $clicks = (int) round($impressions * $ctr);
                            
                            $cpcNoise = rand(90, 110) / 100.0;
                            $cpc = $config['cpc_base'] * $cpcNoise;
                            $spend = round($clicks * $cpc, 2);

                            $cvrNoise = rand(85, 115) / 100.0;
                            $conversionRate = $config['cvr_base'] * $cvrNoise;
                            $conversions = (int) round($clicks * $conversionRate);
                            
                            $aovNoise = rand(95, 105) / 100.0;
                            $aov = $config['aov_base'] * $aovNoise;
                            $conversionValue = round($conversions * $aov, 2);

                            $cpm = $impressions > 0 ? round(($spend / $impressions) * 1000, 2) : 0;
                            $roas = $spend > 0 ? round($conversionValue / $spend, 2) : 0;

                            AdAnalytic::create([
                                'entity_type' => 'ad',
                                'entity_id' => $ad->id,
                                'date' => $date->toDateString(),
                                'impressions' => $impressions,
                                'clicks' => $clicks,
                                'spend' => $spend,
                                'conversions' => $conversions,
                                'conversion_value' => $conversionValue,
                                'cpc' => $clicks > 0 ? round($spend / $clicks, 2) : 0,
                                'ctr' => $impressions > 0 ? round($clicks / $impressions, 4) * 100 : 0,
                                'cpm' => $cpm,
                                'roas' => $roas,
                            ]);
                        }
                    }
                }
            }

            // Aggregate Ad to AdSet
            $adSets = AdSet::all();
            foreach ($adSets as $adSet) {
                $ads = $adSet->ads;
                for ($d = 0; $d < 60; $d++) {
                    $date = $startDate->copy()->addDays($d)->toDateString();
                    $impressions = 0;
                    $clicks = 0;
                    $spend = 0;
                    $conversions = 0;
                    $conversionValue = 0;

                    foreach ($ads as $ad) {
                        $analytic = AdAnalytic::where('entity_type', 'ad')
                            ->where('entity_id', $ad->id)
                            ->where('date', $date)
                            ->first();
                        if ($analytic) {
                            $impressions += $analytic->impressions;
                            $clicks += $analytic->clicks;
                            $spend += $analytic->spend;
                            $conversions += $analytic->conversions;
                            $conversionValue += $analytic->conversion_value;
                        }
                    }

                    $cpm = $impressions > 0 ? round(($spend / $impressions) * 1000, 2) : 0;
                    $roas = $spend > 0 ? round($conversionValue / $spend, 2) : 0;

                    AdAnalytic::create([
                        'entity_type' => 'ad_set',
                        'entity_id' => $adSet->id,
                        'date' => $date,
                        'impressions' => $impressions,
                        'clicks' => $clicks,
                        'spend' => $spend,
                        'conversions' => $conversions,
                        'conversion_value' => $conversionValue,
                        'cpc' => $clicks > 0 ? round($spend / $clicks, 2) : 0,
                        'ctr' => $impressions > 0 ? round($clicks / $impressions, 4) * 100 : 0,
                        'cpm' => $cpm,
                        'roas' => $roas,
                    ]);
                }
            }

            // Aggregate AdSet to Campaign
            $campaigns = Campaign::all();
            $totalSpend = 0;
            foreach ($campaigns as $campaign) {
                $campaignAdSets = $campaign->adSets;
                $campaignTotalBudget = 0;
                for ($d = 0; $d < 60; $d++) {
                    $date = $startDate->copy()->addDays($d)->toDateString();
                    $impressions = 0;
                    $clicks = 0;
                    $spend = 0;
                    $conversions = 0;
                    $conversionValue = 0;

                    foreach ($campaignAdSets as $adSet) {
                        $analytic = AdAnalytic::where('entity_type', 'ad_set')
                            ->where('entity_id', $adSet->id)
                            ->where('date', $date)
                            ->first();
                        if ($analytic) {
                            $impressions += $analytic->impressions;
                            $clicks += $analytic->clicks;
                            $spend += $analytic->spend;
                            $conversions += $analytic->conversions;
                            $conversionValue += $analytic->conversion_value;
                        }
                    }

                    $cpm = $impressions > 0 ? round(($spend / $impressions) * 1000, 2) : 0;
                    $roas = $spend > 0 ? round($conversionValue / $spend, 2) : 0;

                    AdAnalytic::create([
                        'entity_type' => 'campaign',
                        'entity_id' => $campaign->id,
                        'date' => $date,
                        'impressions' => $impressions,
                        'clicks' => $clicks,
                        'spend' => $spend,
                        'conversions' => $conversions,
                        'conversion_value' => $conversionValue,
                        'cpc' => $clicks > 0 ? round($spend / $clicks, 2) : 0,
                        'ctr' => $impressions > 0 ? round($clicks / $impressions, 4) * 100 : 0,
                        'cpm' => $cpm,
                        'roas' => $roas,
                    ]);
                    $campaignTotalBudget += $spend;
                    $totalSpend += $spend;
                }
                
                $campaign->update(['budget_amount' => $campaignTotalBudget / 60]); // avg daily budget
            }

            DB::commit();

            $this->command->info("Seeding completed successfully.");
            $this->command->info("Total 60-day spend generated: $" . number_format($totalSpend, 2));

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Seeding failed: " . $e->getMessage());
        }
    }
}
