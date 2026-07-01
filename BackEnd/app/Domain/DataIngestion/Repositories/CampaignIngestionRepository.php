<?php

namespace App\Domain\DataIngestion\Repositories;

use App\Domain\DataIngestion\Contracts\Repositories\CampaignIngestionRepositoryInterface;
use App\Models\Campaign;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Domain\DataIngestion\DTOs\CampaignSummaryDTO;

class CampaignIngestionRepository implements CampaignIngestionRepositoryInterface
{
    public function getCompletedCampaigns(int $userId): Collection
    {
        $campaigns = Campaign::where('user_id', $userId)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->get();

        $result = collect();

        foreach ($campaigns as $campaign) {
            $stats = DB::table('ad_analytics')
                ->where('entity_type', 'campaign')
                ->where('entity_id', $campaign->id)
                ->select(
                    DB::raw('SUM(spend) as total_spend'),
                    DB::raw('SUM(conversion_value) as total_revenue'),
                    DB::raw('SUM(clicks) as total_clicks'),
                    DB::raw('SUM(impressions) as total_impressions'),
                    DB::raw('SUM(conversions) as total_conversions'),
                    DB::raw('MIN(date) as date_range_start'),
                    DB::raw('MAX(date) as date_range_end')
                )->first();

            $totalSpend = (float) ($stats->total_spend ?? 0);
            $totalRevenue = (float) ($stats->total_revenue ?? 0);
            $averageRoas = $totalSpend > 0 ? $totalRevenue / $totalSpend : 0;

            $adSetCount = $campaign->adSets()->count();
            // Using DB to count ads to avoid n+1 or loading all
            $adCount = DB::table('ads')
                ->join('ad_sets', 'ads.ad_set_id', '=', 'ad_sets.id')
                ->where('ad_sets.campaign_id', $campaign->id)
                ->count();

            $result->push(new CampaignSummaryDTO(
                id: $campaign->id,
                name: $campaign->name,
                platform: $campaign->platform,
                objective: $campaign->objective,
                totalSpend: $totalSpend,
                totalRevenue: $totalRevenue,
                averageRoas: $averageRoas,
                totalClicks: (int) ($stats->total_clicks ?? 0),
                totalImpressions: (int) ($stats->total_impressions ?? 0),
                totalConversions: (int) ($stats->total_conversions ?? 0),
                dateRangeStart: $stats->date_range_start ?? null,
                dateRangeEnd: $stats->date_range_end ?? null,
                adSetCount: $adSetCount,
                adCount: $adCount,
                createdAt: $campaign->created_at->toDateTimeString()
            ));
        }

        return $result;
    }

    public function getCampaignWithStats(int $campaignId, int $userId): ?array
    {
        $campaign = Campaign::with(['adSets'])->where('id', $campaignId)->where('user_id', $userId)->first();
        if (!$campaign) {
            return null;
        }

        $campaignStats = DB::table('ad_analytics')
            ->where('entity_type', 'campaign')
            ->where('entity_id', $campaign->id)
            ->select(
                DB::raw('SUM(spend) as total_spend'),
                DB::raw('SUM(conversion_value) as total_revenue'),
                DB::raw('SUM(clicks) as total_clicks'),
                DB::raw('SUM(impressions) as total_impressions'),
                DB::raw('SUM(conversions) as total_conversions'),
                DB::raw('MIN(date) as min_date'),
                DB::raw('MAX(date) as max_date')
            )->first();

        $totalSpend = (float) ($campaignStats->total_spend ?? 0);
        $totalRevenue = (float) ($campaignStats->total_revenue ?? 0);

        $result = [
            'campaign' => [
                'id' => $campaign->id,
                'name' => $campaign->name,
                'platform' => $campaign->platform,
                'objective' => $campaign->objective,
                'status' => $campaign->status,
                'budget_type' => $campaign->budget_type,
                'budget_amount' => $campaign->budget_amount,
                'currency' => $campaign->currency,
            ],
            'date_range' => [
                'start' => $campaignStats->min_date,
                'end' => $campaignStats->max_date,
            ],
            'totals' => [
                'spend' => $totalSpend,
                'revenue' => $totalRevenue,
                'roas' => $totalSpend > 0 ? $totalRevenue / $totalSpend : 0,
                'clicks' => (int) ($campaignStats->total_clicks ?? 0),
                'impressions' => (int) ($campaignStats->total_impressions ?? 0),
                'conversions' => (int) ($campaignStats->total_conversions ?? 0),
            ],
            'ad_sets' => []
        ];

        foreach ($campaign->adSets as $adSet) {
            $adSetStats = DB::table('ad_analytics')
                ->where('entity_type', 'ad_set')
                ->where('entity_id', $adSet->id)
                ->select(
                    DB::raw('SUM(spend) as total_spend'),
                    DB::raw('SUM(conversion_value) as total_revenue'),
                    DB::raw('SUM(clicks) as total_clicks'),
                    DB::raw('SUM(impressions) as total_impressions'),
                    DB::raw('SUM(conversions) as total_conversions')
                )->first();

            $asSpend = (float) ($adSetStats->total_spend ?? 0);
            $asRev = (float) ($adSetStats->total_revenue ?? 0);

            $result['ad_sets'][] = [
                'id' => $adSet->id,
                'name' => $adSet->name,
                'optimization_goal' => $adSet->optimization_goal,
                'budget_amount' => $adSet->budget_amount,
                'stats' => [
                    'spend' => $asSpend,
                    'revenue' => $asRev,
                    'roas' => $asSpend > 0 ? $asRev / $asSpend : 0,
                    'clicks' => (int) ($adSetStats->total_clicks ?? 0),
                    'impressions' => (int) ($adSetStats->total_impressions ?? 0),
                    'conversions' => (int) ($adSetStats->total_conversions ?? 0),
                ]
            ];
        }

        return $result;
    }
}
