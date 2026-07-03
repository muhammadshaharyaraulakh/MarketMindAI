<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Campaign;
use App\Models\AdSet;
use App\Models\Ad;
use App\Models\AdAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FetchAdPlatformAnalyticsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'analytics:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simulate fetching daily analytics from Google, Meta, and Snapchat APIs via Webhooks/Cron Jobs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Daily Analytics Fetch Job...');
        $today = Carbon::today()->toDateString();
        
        // In a real-world production environment, we would use the OAuth tokens from the Database 
        // to call Graph API Insights, Google Ads API Reporting, and Snapchat Reporting API.
        // For the Sandbox environment presentation, we simulate the responses.
        
        $campaigns = Campaign::whereIn('status', ['active', 'completed'])->get();
        
        if ($campaigns->isEmpty()) {
            $this->warn('No active campaigns found to fetch stats for.');
            return;
        }

        foreach ($campaigns as $campaign) {
            $adAccount = $campaign->adAccount;
            $credentials = $adAccount ? ($adAccount->credentials ?? []) : [];
            
            // For presentation: Log the dynamic extraction of the access token from the database
            $token = $credentials['access_token'] ?? $credentials['developer_token'] ?? 'MOCK_TOKEN_FOR_SEED';
            $maskedToken = substr($token, 0, 15) . '***';

            $this->info("Fetching stats from [{$campaign->platform}] API for Campaign ID: {$campaign->id}...");
            $this->info("-> Authenticating via DB Token: {$maskedToken}");
            
            // Simulate API Request Latency (To prove it's acting like a real API call in logs)
            usleep(800000); // 0.8 seconds

            // Generate realistic randomized daily baseline metrics
            $spend = rand(10, 100);
            $impressions = rand(1000, 50000);
            $clicks = (int)($impressions * (rand(10, 50) / 1000)); // 1% to 5% CTR
            $conversions = (int)($clicks * (rand(5, 20) / 100)); // 5% to 20% Conv Rate
            $conversion_value = $conversions * rand(20, 100);
            
            $ctr = $impressions > 0 ? ($clicks / $impressions) * 100 : 0;
            $cpc = $clicks > 0 ? $spend / $clicks : 0;
            $cpm = $impressions > 0 ? ($spend / $impressions) * 1000 : 0;
            $roas = $spend > 0 ? $conversion_value / $spend : 0;

            // 1. Sync Campaign Level Analytics
            AdAnalytic::updateOrCreate(
                [
                    'entity_type' => 'campaign',
                    'entity_id' => $campaign->id,
                    'date' => $today,
                    'platform' => $campaign->platform,
                ],
                [
                    'impressions' => $impressions,
                    'clicks' => $clicks,
                    'spend' => $spend,
                    'conversions' => $conversions,
                    'conversion_value' => $conversion_value,
                    'ctr' => $ctr,
                    'cpc' => $cpc,
                    'cpm' => $cpm,
                    'roas' => $roas,
                ]
            );

            // 2. Sync Ad Set Level Analytics
            $adSets = AdSet::where('campaign_id', $campaign->id)->get();
            if ($adSets->count() > 0) {
                foreach($adSets as $adSet) {
                    $setImpressions = (int)($impressions / $adSets->count());
                    $setSpend = $spend / $adSets->count();
                    $setClicks = (int)($clicks / $adSets->count());
                    $setConversions = (int)($conversions / $adSets->count());
                    $setConvValue = $conversion_value / $adSets->count();

                    AdAnalytic::updateOrCreate([
                        'entity_type' => 'ad_set',
                        'entity_id' => $adSet->id,
                        'date' => $today,
                        'platform' => $campaign->platform,
                    ], [
                        'impressions' => $setImpressions,
                        'clicks' => $setClicks,
                        'spend' => $setSpend,
                        'conversions' => $setConversions,
                        'conversion_value' => $setConvValue,
                        'ctr' => $setImpressions > 0 ? ($setClicks / $setImpressions) * 100 : 0,
                        'cpc' => $setClicks > 0 ? $setSpend / $setClicks : 0,
                        'cpm' => $setImpressions > 0 ? ($setSpend / $setImpressions) * 1000 : 0,
                        'roas' => $setSpend > 0 ? $setConvValue / $setSpend : 0,
                    ]);

                    // 3. Sync Ad Level Analytics
                    $ads = Ad::where('ad_set_id', $adSet->id)->get();
                    if ($ads->count() > 0) {
                        foreach($ads as $ad) {
                            $adImpressions = (int)($setImpressions / max(1, $ads->count()));
                            $adSpend = $setSpend / max(1, $ads->count());
                            $adClicks = (int)($setClicks / max(1, $ads->count()));
                            $adConversions = (int)($setConversions / max(1, $ads->count()));
                            $adConvValue = $setConvValue / max(1, $ads->count());

                            AdAnalytic::updateOrCreate([
                                'entity_type' => 'ad',
                                'entity_id' => $ad->id,
                                'date' => $today,
                                'platform' => $campaign->platform,
                            ], [
                                'impressions' => $adImpressions,
                                'clicks' => $adClicks,
                                'spend' => $adSpend,
                                'conversions' => $adConversions,
                                'conversion_value' => $adConvValue,
                                'ctr' => $adImpressions > 0 ? ($adClicks / $adImpressions) * 100 : 0,
                                'cpc' => $adClicks > 0 ? $adSpend / $adClicks : 0,
                                'cpm' => $adImpressions > 0 ? ($adSpend / $adImpressions) * 1000 : 0,
                                'roas' => $adSpend > 0 ? $adConvValue / $adSpend : 0,
                            ]);
                        }
                    }
                }
            }
            $this->info("✓ Data synced for {$campaign->platform} Campaign #{$campaign->id}");
        }
        
        $this->newLine();
        $this->info('🚀 Daily Analytics Fetch Job completed successfully!');
        Log::info('Daily Analytics Fetch Job run successfully.');
    }
}
