<?php

namespace App\App\Domain\Reports\Services;

use App\App\Domain\Reports\Contracts\Services\ReportDataServiceInterface;
use Illuminate\Support\Facades\DB;

class ReportDataService implements ReportDataServiceInterface
{
    public function getCampaignOverview(int $campaignId): array
    {
        $campaign = DB::table('campaigns')->where('id', $campaignId)->first();
        if (!$campaign) {
            return [];
        }
        return [
            'id' => $campaign->id,
            'name' => $campaign->name,
            'platform' => $campaign->platform ?? 'unknown',
            'start_date' => $campaign->start_date ?? null,
            'end_date' => $campaign->end_date ?? null,
            'status' => $campaign->status ?? 'unknown',
            'budget' => $campaign->budget ?? 0,
        ];
    }

    public function getKpiScorecard(int $campaignId): array
    {
        $stats = DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->selectRaw('
                SUM(spend) as total_spend,
                SUM(conversion_value) as total_revenue,
                SUM(conversions) as total_conversions,
                SUM(clicks) as total_clicks,
                SUM(impressions) as total_impressions
            ')
            ->first();

        $spend = $stats->total_spend ?? 0;
        $revenue = $stats->total_revenue ?? 0;
        $conversions = $stats->total_conversions ?? 0;
        $clicks = $stats->total_clicks ?? 0;
        $impressions = $stats->total_impressions ?? 0;

        return [
            'total_spend' => round($spend, 2),
            'total_revenue' => round($revenue, 2),
            'total_conversions' => $conversions,
            'total_clicks' => $clicks,
            'total_impressions' => $impressions,
            'average_roas' => $spend > 0 ? round($revenue / $spend, 2) : 0,
            'average_ctr' => $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0,
            'average_cpa' => $conversions > 0 ? round($spend / $conversions, 2) : 0,
        ];
    }

    public function getDailyTrend(int $campaignId): array
    {
        return DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->selectRaw('
                date,
                SUM(spend) as spend,
                SUM(conversion_value) as revenue,
                (SUM(conversion_value) / NULLIF(SUM(spend), 0)) as roas,
                (SUM(clicks) / NULLIF(SUM(impressions), 0) * 100) as ctr
            ')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->date,
                    'spend' => round($row->spend, 2),
                    'revenue' => round($row->revenue, 2),
                    'roas' => round($row->roas ?? 0, 2),
                    'ctr' => round($row->ctr ?? 0, 2),
                ];
            })
            ->toArray();
    }

    public function getAdSetBreakdown(int $campaignId): array
    {
        return DB::table('ad_sets')
            ->leftJoin('ad_analytics', function ($join) {
                $join->on('ad_sets.id', '=', 'ad_analytics.entity_id')
                     ->where('ad_analytics.entity_type', '=', 'ad_set');
            })
            ->where('ad_sets.campaign_id', $campaignId)
            ->selectRaw('
                ad_sets.name,
                SUM(ad_analytics.spend) as spend,
                SUM(ad_analytics.conversions) as conversions,
                (SUM(ad_analytics.conversion_value) / NULLIF(SUM(ad_analytics.spend), 0)) as roas,
                (SUM(ad_analytics.clicks) / NULLIF(SUM(ad_analytics.impressions), 0) * 100) as ctr,
                (SUM(ad_analytics.spend) / NULLIF(SUM(ad_analytics.conversions), 0)) as cpa
            ')
            ->groupBy('ad_sets.id', 'ad_sets.name')
            ->orderByRaw('roas DESC')
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->name,
                    'spend' => round($row->spend ?? 0, 2),
                    'conversions' => $row->conversions ?? 0,
                    'roas' => round($row->roas ?? 0, 2),
                    'ctr' => round($row->ctr ?? 0, 2),
                    'cpa' => round($row->cpa ?? 0, 2),
                ];
            })
            ->toArray();
    }

    public function getAdCreativeBreakdown(int $campaignId): array
    {
        return DB::table('ads')
            ->leftJoin('ad_analytics', function ($join) {
                $join->on('ads.id', '=', 'ad_analytics.entity_id')
                     ->where('ad_analytics.entity_type', '=', 'ad');
            })
            ->join('ad_sets', 'ads.ad_set_id', '=', 'ad_sets.id')
            ->where('ad_sets.campaign_id', $campaignId)
            ->selectRaw('
                ads.name,
                ads.ad_format as format,
                ads.headline,
                SUM(ad_analytics.conversions) as conversions,
                (SUM(ad_analytics.clicks) / NULLIF(SUM(ad_analytics.impressions), 0) * 100) as ctr,
                (SUM(ad_analytics.spend) / NULLIF(SUM(ad_analytics.conversions), 0)) as cpa
            ')
            ->groupBy('ads.id', 'ads.name', 'ads.ad_format', 'ads.headline')
            ->orderByRaw('ctr DESC')
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->name,
                    'format' => $row->format ?? 'Unknown',
                    'headline' => $row->headline ?? 'No Headline',
                    'conversions' => $row->conversions ?? 0,
                    'ctr' => round($row->ctr ?? 0, 2),
                    'cpa' => round($row->cpa ?? 0, 2),
                ];
            })
            ->toArray();
    }

    public function getPlatformBreakdown(int $campaignId): array
    {
        return DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->whereNotNull('platform')
            ->selectRaw('
                platform,
                SUM(spend) as spend,
                SUM(impressions) as impressions,
                SUM(clicks) as clicks,
                SUM(conversions) as conversions,
                (SUM(spend) / NULLIF(SUM(conversions), 0)) as cpa,
                (SUM(conversion_value) / NULLIF(SUM(spend), 0)) as roas
            ')
            ->groupBy('platform')
            ->get()
            ->map(function ($row) {
                return [
                    'platform' => $row->platform,
                    'spend' => round($row->spend ?? 0, 2),
                    'impressions' => $row->impressions ?? 0,
                    'clicks' => $row->clicks ?? 0,
                    'conversions' => $row->conversions ?? 0,
                    'cpa' => round($row->cpa ?? 0, 2),
                    'roas' => round($row->roas ?? 0, 2),
                ];
            })
            ->toArray();
    }

    public function getTopPerformers(int $campaignId): array
    {
        $topAdSet = DB::table('ad_sets')
            ->leftJoin('ad_analytics', function ($join) {
                $join->on('ad_sets.id', '=', 'ad_analytics.entity_id')
                     ->where('ad_analytics.entity_type', '=', 'ad_set');
            })
            ->where('ad_sets.campaign_id', $campaignId)
            ->selectRaw('ad_sets.name, (SUM(ad_analytics.conversion_value) / NULLIF(SUM(ad_analytics.spend), 0)) as roas')
            ->groupBy('ad_sets.id', 'ad_sets.name')
            ->orderByRaw('roas DESC')
            ->first();

        $topAd = DB::table('ads')
            ->leftJoin('ad_analytics', function ($join) {
                $join->on('ads.id', '=', 'ad_analytics.entity_id')
                     ->where('ad_analytics.entity_type', '=', 'ad');
            })
            ->join('ad_sets', 'ads.ad_set_id', '=', 'ad_sets.id')
            ->where('ad_sets.campaign_id', $campaignId)
            ->selectRaw('ads.name, (SUM(ad_analytics.clicks) / NULLIF(SUM(ad_analytics.impressions), 0) * 100) as ctr')
            ->groupBy('ads.id', 'ads.name')
            ->orderByRaw('ctr DESC')
            ->first();

        $topPlatform = DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->whereNotNull('platform')
            ->selectRaw('platform, SUM(conversions) as conversions')
            ->groupBy('platform')
            ->orderByRaw('conversions DESC')
            ->first();

        return [
            'top_ad_set' => $topAdSet ? ['name' => $topAdSet->name, 'roas' => round($topAdSet->roas ?? 0, 2)] : null,
            'top_ad' => $topAd ? ['name' => $topAd->name, 'ctr' => round($topAd->ctr ?? 0, 2)] : null,
            'top_platform' => $topPlatform ? ['name' => $topPlatform->platform, 'conversions' => $topPlatform->conversions] : null,
        ];
    }

    public function getDayOfWeekPerformance(int $campaignId): array
    {
        return DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->selectRaw('
                DAYOFWEEK(date) as day_of_week,
                AVG(spend) as avg_spend,
                (SUM(conversion_value) / NULLIF(SUM(spend), 0)) as avg_roas
            ')
            ->groupByRaw('DAYOFWEEK(date)')
            ->orderByRaw('DAYOFWEEK(date)')
            ->get()
            ->map(function ($row) {
                $days = [1 => 'Sun', 2 => 'Mon', 3 => 'Tue', 4 => 'Wed', 5 => 'Thu', 6 => 'Fri', 7 => 'Sat'];
                return [
                    'day' => $days[$row->day_of_week] ?? 'Unknown',
                    'spend' => round($row->avg_spend ?? 0, 2),
                    'roas' => round($row->avg_roas ?? 0, 2),
                ];
            })
            ->toArray();
    }

    public function getConversionFunnel(int $campaignId): array
    {
        $stats = DB::table('ad_analytics')
            ->where('entity_id', $campaignId)
            ->where('entity_type', 'campaign')
            ->selectRaw('
                SUM(impressions) as impressions,
                SUM(clicks) as clicks,
                SUM(conversions) as conversions
            ')
            ->first();

        $impressions = $stats->impressions ?? 0;
        $clicks = $stats->clicks ?? 0;
        $conversions = $stats->conversions ?? 0;

        $impressionToClickDropoff = $impressions > 0 ? round((($impressions - $clicks) / $impressions) * 100, 2) : 0;
        $clickToConversionDropoff = $clicks > 0 ? round((($clicks - $conversions) / $clicks) * 100, 2) : 0;

        return [
            'impressions' => $impressions,
            'clicks' => $clicks,
            'conversions' => $conversions,
            'impression_to_click_dropoff_percent' => $impressionToClickDropoff,
            'click_to_conversion_dropoff_percent' => $clickToConversionDropoff,
        ];
    }
}
