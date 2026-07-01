<?php

namespace App\Domain\DataIngestion\DTOs;

class CsvRowDTO
{
    public function __construct(
        public string $date,
        public string $platform,
        public string $campaignName,
        public string $campaignObjective,
        public string $campaignBudgetType,
        public float $campaignBudgetAmount,
        public string $campaignCurrency,
        public string $campaignBidStrategy,
        public string $adsetName,
        public string $adsetOptimizationGoal,
        public string $adsetBillingEvent,
        public float $adsetBudgetAmount,
        public int $adsetAgeMin,
        public int $adsetAgeMax,
        public string $adsetGenders,
        public string $adsetLocations,
        public string $adName,
        public string $adFormat,
        public string $adHeadline,
        public string $adCtaType,
        public int $impressions,
        public int $clicks,
        public float $spend,
        public int $conversions,
        public float $conversionValue
    ) {}

    public static function fromArray(array $row): self
    {
        return new self(
            date: $row['date'],
            platform: $row['platform'],
            campaignName: $row['campaign_name'],
            campaignObjective: $row['campaign_objective'],
            campaignBudgetType: $row['campaign_budget_type'],
            campaignBudgetAmount: (float) $row['campaign_budget_amount'],
            campaignCurrency: $row['campaign_currency'],
            campaignBidStrategy: $row['campaign_bid_strategy'],
            adsetName: $row['adset_name'],
            adsetOptimizationGoal: $row['adset_optimization_goal'],
            adsetBillingEvent: $row['adset_billing_event'],
            adsetBudgetAmount: (float) $row['adset_budget_amount'],
            adsetAgeMin: (int) $row['adset_age_min'],
            adsetAgeMax: (int) $row['adset_age_max'],
            adsetGenders: $row['adset_genders'],
            adsetLocations: $row['adset_locations'],
            adName: $row['ad_name'],
            adFormat: $row['ad_format'],
            adHeadline: $row['ad_headline'],
            adCtaType: $row['ad_cta_type'],
            impressions: (int) $row['impressions'],
            clicks: (int) $row['clicks'],
            spend: (float) $row['spend'],
            conversions: (int) $row['conversions'],
            conversionValue: (float) $row['conversion_value']
        );
    }
}
