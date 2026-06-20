<?php

namespace Domain\Overview\Services;

use Domain\Overview\Contracts\Services\OverviewServiceInterface;
use App\Models\Campaign;
use App\Models\AdAnalytic;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OverviewService implements OverviewServiceInterface
{
    private function getCampaignIds()
    {
        return Campaign::where('user_id', auth()->id())->pluck('id')->toArray();
    }

    public function getKpiCards(): array
    {
        $campaignIds = $this->getCampaignIds();
        $now = Carbon::now();
        $startDate = $now->copy()->subDays(29)->toDateString();
        $endDate = $now->toDateString();
        
        $priorStartDate = $now->copy()->subDays(59)->toDateString();
        $priorEndDate = $now->copy()->subDays(30)->toDateString();

        $currentData = AdAnalytic::where('entity_type', 'campaign')
            ->whereIn('entity_id', $campaignIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('
                SUM(spend) as total_spend,
                SUM(conversion_value) as total_revenue,
                SUM(clicks) as total_clicks,
                SUM(impressions) as total_impressions,
                SUM(conversions) as total_conversions
            ')->first();

        $priorData = AdAnalytic::where('entity_type', 'campaign')
            ->whereIn('entity_id', $campaignIds)
            ->whereBetween('date', [$priorStartDate, $priorEndDate])
            ->selectRaw('
                SUM(spend) as total_spend,
                SUM(conversion_value) as total_revenue,
                SUM(clicks) as total_clicks,
                SUM(impressions) as total_impressions,
                SUM(conversions) as total_conversions
            ')->first();

        $activeCampaignsCount = Campaign::where('user_id', auth()->id())
            ->where('status', 'active')
            ->count();

        // Calculate values
        $curSpend = $currentData->total_spend ?? 0;
        $curRevenue = $currentData->total_revenue ?? 0;
        $curConversions = $currentData->total_conversions ?? 0;
        $curClicks = $currentData->total_clicks ?? 0;
        $curImpressions = $currentData->total_impressions ?? 0;
        
        $curRoas = $curSpend > 0 ? $curRevenue / $curSpend : 0;
        $curCtr = $curImpressions > 0 ? ($curClicks / $curImpressions) * 100 : 0;
        $curCpa = $curConversions > 0 ? $curSpend / $curConversions : 0;

        // Prior values for comparison
        $priSpend = $priorData->total_spend ?? 0;
        $priRevenue = $priorData->total_revenue ?? 0;
        $priConversions = $priorData->total_conversions ?? 0;
        $priClicks = $priorData->total_clicks ?? 0;
        $priImpressions = $priorData->total_impressions ?? 0;

        $priRoas = $priSpend > 0 ? $priRevenue / $priSpend : 0;
        $priCtr = $priImpressions > 0 ? ($priClicks / $priImpressions) * 100 : 0;
        $priCpa = $priConversions > 0 ? $priSpend / $priConversions : 0;

        // Platform ROAS
        $platformStats = AdAnalytic::where('ad_analytics.entity_type', 'campaign')
            ->whereIn('ad_analytics.entity_id', $campaignIds)
            ->whereBetween('ad_analytics.date', [$startDate, $endDate])
            ->join('campaigns', 'campaigns.id', '=', 'ad_analytics.entity_id')
            ->selectRaw('campaigns.platform, SUM(ad_analytics.conversion_value) as rev, SUM(ad_analytics.spend) as spd')
            ->groupBy('campaigns.platform')
            ->get();

        $bestPlatform = null;
        $bestRoas = 0;
        foreach ($platformStats as $stat) {
            $roas = $stat->spd > 0 ? $stat->rev / $stat->spd : 0;
            if ($roas > $bestRoas) {
                $bestRoas = $roas;
                $bestPlatform = $stat->platform;
            }
        }

        // Prior Platform ROAS for the Best Platform
        $priBestPlatformStats = AdAnalytic::where('ad_analytics.entity_type', 'campaign')
            ->whereIn('ad_analytics.entity_id', $campaignIds)
            ->whereBetween('ad_analytics.date', [$priorStartDate, $priorEndDate])
            ->join('campaigns', 'campaigns.id', '=', 'ad_analytics.entity_id')
            ->where('campaigns.platform', $bestPlatform)
            ->selectRaw('SUM(ad_analytics.conversion_value) as rev, SUM(ad_analytics.spend) as spd')
            ->first();

        $priBestRoas = $priBestPlatformStats && $priBestPlatformStats->spd > 0 
            ? $priBestPlatformStats->rev / $priBestPlatformStats->spd 
            : 0;

        $calcChange = function ($cur, $pri) use ($priSpend) { // using priSpend as a proxy for if prior data exists
            if ($priSpend == 0) return null; 
            if ($pri == 0) return $cur > 0 ? 100 : 0;
            return (($cur - $pri) / $pri) * 100;
        };

        return [
            'total_spend' => [
                'value' => $curSpend,
                'change' => $calcChange($curSpend, $priSpend)
            ],
            'total_revenue' => [
                'value' => $curRevenue,
                'change' => $calcChange($curRevenue, $priRevenue)
            ],
            'average_roas' => [
                'value' => $curRoas,
                'change' => $calcChange($curRoas, $priRoas)
            ],
            'portfolio_ctr' => [
                'value' => $curCtr,
                'change' => $calcChange($curCtr, $priCtr)
            ],
            'total_conversions' => [
                'value' => $curConversions,
                'change' => $calcChange($curConversions, $priConversions)
            ],
            'avg_cpa' => [
                'value' => $curCpa,
                'change' => $calcChange($curCpa, $priCpa)
            ],
            'active_campaigns' => [
                'value' => $activeCampaignsCount,
                'change' => 0
            ],
            'best_platform' => [
                'platform' => $bestPlatform,
                'roas' => $bestRoas,
                'change' => $calcChange($bestRoas, $priBestRoas)
            ]
        ];
    }

    public function getRevenueSpendTrend(): array
    {
        $campaignIds = $this->getCampaignIds();
        $startDate = Carbon::now()->subDays(29)->toDateString();
        $endDate = Carbon::now()->toDateString();

        $rows = AdAnalytic::where('entity_type', 'campaign')
            ->whereIn('entity_id', $campaignIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('date, SUM(spend) as spend, SUM(conversion_value) as revenue')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return $rows->map(function ($row) {
            return [
                'date' => $row->date,
                'spend' => (float) $row->spend,
                'revenue' => (float) $row->revenue,
                'roas' => $row->spend > 0 ? round($row->revenue / $row->spend, 2) : 0
            ];
        })->toArray();
    }

    public function getPlatformAttribution(): array
    {
        $campaignIds = $this->getCampaignIds();
        $startDate = Carbon::now()->subDays(29)->toDateString();
        $endDate = Carbon::now()->toDateString();

        $rows = AdAnalytic::where('ad_analytics.entity_type', 'campaign')
            ->whereIn('ad_analytics.entity_id', $campaignIds)
            ->whereBetween('ad_analytics.date', [$startDate, $endDate])
            ->join('campaigns', 'campaigns.id', '=', 'ad_analytics.entity_id')
            ->selectRaw('campaigns.platform, SUM(ad_analytics.spend) as spend')
            ->groupBy('campaigns.platform')
            ->get();

        $totalSpend = $rows->sum('spend');

        return $rows->map(function ($row) use ($totalSpend) {
            return [
                'platform' => ucfirst($row->platform),
                'spend' => (float) $row->spend,
                'percentage' => $totalSpend > 0 ? round(($row->spend / $totalSpend) * 100, 1) : 0
            ];
        })->toArray();
    }

    public function getPlatformEfficiency(): array
    {
        $campaignIds = $this->getCampaignIds();
        $startDate = Carbon::now()->subDays(29)->toDateString();
        $endDate = Carbon::now()->toDateString();

        $rows = AdAnalytic::where('ad_analytics.entity_type', 'campaign')
            ->whereIn('ad_analytics.entity_id', $campaignIds)
            ->whereBetween('ad_analytics.date', [$startDate, $endDate])
            ->join('campaigns', 'campaigns.id', '=', 'ad_analytics.entity_id')
            ->selectRaw('campaigns.platform, SUM(ad_analytics.spend) as spend, SUM(ad_analytics.conversion_value) as revenue')
            ->groupBy('campaigns.platform')
            ->get();

        return $rows->map(function ($row) {
            return [
                'platform' => ucfirst($row->platform),
                'spend' => (float) $row->spend,
                'revenue' => (float) $row->revenue,
            ];
        })->toArray();
    }

    public function getCpaTrend(): array
    {
        $campaignIds = $this->getCampaignIds();
        $startDate = Carbon::now()->subDays(29)->toDateString();
        $endDate = Carbon::now()->toDateString();

        $rows = AdAnalytic::where('entity_type', 'campaign')
            ->whereIn('entity_id', $campaignIds)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('date, SUM(spend) as spend, SUM(conversions) as conversions')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $totalSpend = 0;
        $totalConvs = 0;
        
        $daily = $rows->map(function ($row) use (&$totalSpend, &$totalConvs) {
            $totalSpend += $row->spend;
            $totalConvs += $row->conversions;
            return [
                'date' => $row->date,
                'cpa' => $row->conversions > 0 ? round($row->spend / $row->conversions, 2) : 0
            ];
        })->toArray();

        $currentAvg = $totalConvs > 0 ? round($totalSpend / $totalConvs, 2) : 0;

        return [
            'current_avg' => $currentAvg,
            'daily' => $daily
        ];
    }
}
