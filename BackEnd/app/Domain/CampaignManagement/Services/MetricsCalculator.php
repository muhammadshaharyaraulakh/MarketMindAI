<?php

namespace App\App\Domain\CampaignManagement\Services;

class MetricsCalculator
{
    /**
     * Calculate derived metrics (CTR, CPC, CPM, ROAS) from raw numbers.
     *
     * @param float $spend
     * @param float $revenue
     * @param int $impressions
     * @param int $clicks
     * @return array
     */
    public static function calculateDerived(float $spend, float $revenue, int $impressions, int $clicks): array
    {
        return [
            'ctr' => $impressions > 0 ? ($clicks / $impressions) * 100 : 0,
            'cpc' => $clicks > 0 ? $spend / $clicks : 0,
            'cpm' => $impressions > 0 ? ($spend / $impressions) * 1000 : 0,
            'roas' => $spend > 0 ? $revenue / $spend : 0,
        ];
    }
}
