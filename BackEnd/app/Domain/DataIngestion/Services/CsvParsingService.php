<?php

namespace App\Domain\DataIngestion\Services;

use App\Domain\DataIngestion\Contracts\Services\CsvParsingServiceInterface;
use App\Domain\DataIngestion\DTOs\CsvRowDTO;
use App\Models\Campaign;
use App\Models\AdSet;
use App\Models\AdSetTargeting;
use App\Models\Ad;
use App\Models\AdAnalytic;
use App\Models\CsvUpload;
use App\Models\AdAccount;
use Illuminate\Support\Str;

class CsvParsingService implements CsvParsingServiceInterface
{
    private const EXPECTED_HEADERS = [
        'date', 'platform', 'campaign_name', 'campaign_objective',
        'campaign_status', 'campaign_budget_type', 'campaign_budget_amount',
        'campaign_currency', 'campaign_bid_strategy', 'adset_name',
        'adset_optimization_goal', 'adset_billing_event',
        'adset_budget_amount', 'adset_age_min', 'adset_age_max',
        'adset_genders', 'adset_locations', 'ad_name', 'ad_format',
        'ad_headline', 'ad_cta_type', 'impressions', 'clicks', 'spend',
        'conversions', 'conversion_value'
    ];

    public function validateHeaders(array $headers): array
    {
        $normalizedHeaders = array_map('trim', array_map('strtolower', $headers));
        
        $missing = array_diff(self::EXPECTED_HEADERS, $normalizedHeaders);
        
        if (count($missing) > 0) {
            return [
                'valid' => false,
                'missing' => array_values($missing)
            ];
        }

        return ['valid' => true];
    }

    public function parseFile(string $filePath): array
    {
        $rows = [];
        if (($handle = fopen($filePath, 'r')) !== false) {
            $headers = fgetcsv($handle, 0, ",", "\"", "\\");
            $normalizedHeaders = array_map('trim', array_map('strtolower', $headers));

            while (($data = fgetcsv($handle, 0, ",", "\"", "\\")) !== false) {
                // Skip empty lines
                if (count($data) === 1 && $data[0] === null) continue;
                
                $rowAssoc = array_combine($normalizedHeaders, $data);
                $rows[] = CsvRowDTO::fromArray($rowAssoc);
            }
            fclose($handle);
        }

        return $rows;
    }

    public function insertRows(array $rows, int $userId, int $csvUploadId): array
    {
        $campaignsCreated = 0;
        $adSetsCreated = 0;
        $adsCreated = 0;
        $analyticsRows = 0;
        $failedRows = 0;
        
        $newCampaignIds = [];

        // To store daily aggregates for campaign and ad_set
        $campaignAggregates = [];
        $adSetAggregates = [];

        // Get or create default ad account
        $adAccount = AdAccount::firstOrCreate(
            ['user_id' => $userId, 'platform' => 'google'],
            ['account_name' => 'Imported Account', 'currency' => 'USD', 'timezone' => 'UTC']
        );

        // To keep track of newly created campaigns and those to skip
        $processedCampaigns = [];
        $skippedCampaignNames = [];

        foreach ($rows as $row) {
            try {
                $platform = in_array($row->platform, ['google', 'meta', 'snapchat']) ? $row->platform : 'google';
                
                if (in_array($row->campaignName, $skippedCampaignNames)) {
                    continue;
                }

                if (!isset($processedCampaigns[$row->campaignName])) {
                    $existingCampaign = Campaign::where([
                        'user_id' => $userId,
                        'name' => $row->campaignName,
                        'platform' => $platform,
                        'ad_account_id' => $adAccount->id,
                    ])->first();

                    if ($existingCampaign) {
                        $skippedCampaignNames[] = $row->campaignName;
                        continue;
                    }

                    $campaign = Campaign::create([
                        'user_id' => $userId,
                        'name' => $row->campaignName,
                        'platform' => $platform,
                        'ad_account_id' => $adAccount->id,
                        'uuid' => (string) Str::uuid(),
                        'objective' => $row->campaignObjective,
                        'status' => 'completed',
                        'is_imported' => true,
                        'budget_type' => in_array($row->campaignBudgetType, ['daily', 'lifetime']) ? $row->campaignBudgetType : 'daily',
                        'budget_amount' => $row->campaignBudgetAmount,
                        'currency' => $row->campaignCurrency ?: 'USD',
                        'bid_strategy' => $row->campaignBidStrategy,
                        'sync_status' => 'synced',
                    ]);

                    $processedCampaigns[$row->campaignName] = $campaign;
                    $campaignsCreated++;
                    $newCampaignIds[] = $campaign->id;
                }

                $campaign = $processedCampaigns[$row->campaignName];

                // Ad Set
                $adSet = AdSet::firstOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'name' => $row->adsetName,
                    ],
                    [
                        'uuid' => (string) Str::uuid(),
                        'optimization_goal' => in_array($row->adsetOptimizationGoal, ['reach','impressions','link_clicks','landing_page_views','conversions','app_installs','video_views','leads']) ? $row->adsetOptimizationGoal : 'conversions',
                        'billing_event' => in_array($row->adsetBillingEvent, ['cpm','cpc','cpv','cpa','ocpm']) ? $row->adsetBillingEvent : 'cpm',
                        'budget_amount' => $row->adsetBudgetAmount,
                        'sync_status' => 'synced',
                    ]
                );

                if ($adSet->wasRecentlyCreated) {
                    $adSetsCreated++;
                    // Ad Set Targeting
                    AdSetTargeting::create([
                        'ad_set_id' => $adSet->id,
                        'age_min' => $row->adsetAgeMin,
                        'age_max' => $row->adsetAgeMax,
                        'genders' => json_encode([$row->adsetGenders]),
                        'locations' => json_encode([$row->adsetLocations]),
                    ]);
                }

                // Ad
                $ad = Ad::firstOrCreate(
                    [
                        'ad_set_id' => $adSet->id,
                        'name' => $row->adName,
                    ],
                    [
                        'uuid' => (string) Str::uuid(),
                        'ad_format' => in_array($row->adFormat, ['image','video','carousel','collection','responsive','call_only','story']) ? $row->adFormat : 'image',
                        'headline' => $row->adHeadline,
                        'cta_type' => in_array($row->adCtaType, ['shop_now','learn_more','sign_up','download','book_now','contact_us']) ? $row->adCtaType : 'learn_more',
                        'status' => 'approved',
                        'review_status' => 'approved',
                        'sync_status' => 'synced',
                    ]
                );

                if ($ad->wasRecentlyCreated) {
                    $adsCreated++;
                }

                // Calculations
                $ctr = $row->impressions > 0 ? ($row->clicks / $row->impressions) * 100 : 0;
                $cpc = $row->clicks > 0 ? ($row->spend / $row->clicks) : 0;
                $cpm = $row->impressions > 0 ? ($row->spend / $row->impressions) * 1000 : 0;
                $roas = $row->spend > 0 ? ($row->conversionValue / $row->spend) : 0;

                // Ad Analytics
                AdAnalytic::updateOrCreate(
                    [
                        'entity_type' => 'ad',
                        'entity_id' => $ad->id,
                        'date' => $row->date,
                    ],
                    [
                        'platform' => $platform,
                        'impressions' => $row->impressions,
                        'clicks' => $row->clicks,
                        'spend' => $row->spend,
                        'conversions' => $row->conversions,
                        'conversion_value' => $row->conversionValue,
                        'ctr' => $ctr,
                        'cpc' => $cpc,
                        'cpm' => $cpm,
                        'roas' => $roas,
                    ]
                );
                
                $analyticsRows++;

                // Aggregate calculations
                $cKey = $campaign->id . '_' . $row->date;
                if (!isset($campaignAggregates[$cKey])) {
                    $campaignAggregates[$cKey] = [
                        'entity_id' => $campaign->id,
                        'date' => $row->date,
                        'platform' => $platform,
                        'impressions' => 0, 'clicks' => 0, 'spend' => 0,
                        'conversions' => 0, 'conversion_value' => 0
                    ];
                }
                $campaignAggregates[$cKey]['impressions'] += $row->impressions;
                $campaignAggregates[$cKey]['clicks'] += $row->clicks;
                $campaignAggregates[$cKey]['spend'] += $row->spend;
                $campaignAggregates[$cKey]['conversions'] += $row->conversions;
                $campaignAggregates[$cKey]['conversion_value'] += $row->conversionValue;

                $asKey = $adSet->id . '_' . $row->date;
                if (!isset($adSetAggregates[$asKey])) {
                    $adSetAggregates[$asKey] = [
                        'entity_id' => $adSet->id,
                        'date' => $row->date,
                        'platform' => $platform,
                        'impressions' => 0, 'clicks' => 0, 'spend' => 0,
                        'conversions' => 0, 'conversion_value' => 0
                    ];
                }
                $adSetAggregates[$asKey]['impressions'] += $row->impressions;
                $adSetAggregates[$asKey]['clicks'] += $row->clicks;
                $adSetAggregates[$asKey]['spend'] += $row->spend;
                $adSetAggregates[$asKey]['conversions'] += $row->conversions;
                $adSetAggregates[$asKey]['conversion_value'] += $row->conversionValue;

            } catch (\Exception $e) {
                $failedRows++;
            }
        }

        // Insert/Update Aggregates
        foreach ($campaignAggregates as $agg) {
            $ctr = $agg['impressions'] > 0 ? ($agg['clicks'] / $agg['impressions']) * 100 : 0;
            $cpc = $agg['clicks'] > 0 ? ($agg['spend'] / $agg['clicks']) : 0;
            $cpm = $agg['impressions'] > 0 ? ($agg['spend'] / $agg['impressions']) * 1000 : 0;
            $roas = $agg['spend'] > 0 ? ($agg['conversion_value'] / $agg['spend']) : 0;

            AdAnalytic::updateOrCreate(
                [
                    'entity_type' => 'campaign',
                    'entity_id' => $agg['entity_id'],
                    'date' => $agg['date'],
                ],
                [
                    'platform' => $agg['platform'],
                    'impressions' => $agg['impressions'],
                    'clicks' => $agg['clicks'],
                    'spend' => $agg['spend'],
                    'conversions' => $agg['conversions'],
                    'conversion_value' => $agg['conversion_value'],
                    'ctr' => $ctr,
                    'cpc' => $cpc,
                    'cpm' => $cpm,
                    'roas' => $roas,
                ]
            );
        }

        foreach ($adSetAggregates as $agg) {
            $ctr = $agg['impressions'] > 0 ? ($agg['clicks'] / $agg['impressions']) * 100 : 0;
            $cpc = $agg['clicks'] > 0 ? ($agg['spend'] / $agg['clicks']) : 0;
            $cpm = $agg['impressions'] > 0 ? ($agg['spend'] / $agg['impressions']) * 1000 : 0;
            $roas = $agg['spend'] > 0 ? ($agg['conversion_value'] / $agg['spend']) : 0;

            AdAnalytic::updateOrCreate(
                [
                    'entity_type' => 'ad_set',
                    'entity_id' => $agg['entity_id'],
                    'date' => $agg['date'],
                ],
                [
                    'platform' => $agg['platform'],
                    'impressions' => $agg['impressions'],
                    'clicks' => $agg['clicks'],
                    'spend' => $agg['spend'],
                    'conversions' => $agg['conversions'],
                    'conversion_value' => $agg['conversion_value'],
                    'ctr' => $ctr,
                    'cpc' => $cpc,
                    'cpm' => $cpm,
                    'roas' => $roas,
                ]
            );
        }

        if ($csvUploadId) {
            CsvUpload::where('id', $csvUploadId)->update([
                'rows_processed' => $analyticsRows,
                'status' => 'ready'
            ]);
        }

        return [
            'campaigns' => $campaignsCreated,
            'adsets' => $adSetsCreated,
            'ads' => $adsCreated,
            'analytics_rows' => $analyticsRows,
            'failed_rows' => $failedRows,
            'new_campaign_ids' => array_unique($newCampaignIds)
        ];
    }
}
