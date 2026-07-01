<?php

namespace App\App\Domain\Insights\Services;

use App\Models\AdAnalytic;
use App\Models\Campaign;
use App\App\Domain\Insights\Contracts\Services\AnomalyDetectionServiceInterface;
use App\App\Domain\Insights\DTOs\AlertDTO;
use Illuminate\Support\Carbon;

class AnomalyDetectionService implements AnomalyDetectionServiceInterface
{
    public function detectForUser(int $userId): array
    {
        $campaigns = Campaign::where('user_id', $userId)->where('status', 'active')->get();
        $anomalies = [];

        foreach ($campaigns as $campaign) {
            $anomalies = array_merge($anomalies, $this->detectForCampaign($campaign->id, $userId));
        }

        return $anomalies;
    }

    public function detectForCampaign(int $campaignId, int $userId): array
    {
        $campaign = Campaign::where('id', $campaignId)->where('user_id', $userId)->where('status', 'active')->first();
        if (!$campaign) return [];

        $anomalies = [];
        $now = Carbon::now();
        $today = $now->toDateString();
        $threeDaysAgo = $now->copy()->subDays(3)->toDateString();
        $tenDaysAgo = $now->copy()->subDays(10)->toDateString();
        $lastWeekThreeDaysStart = $now->copy()->subDays(10)->toDateString();
        $lastWeekThreeDaysEnd = $now->copy()->subDays(7)->toDateString();

        // Check 1: CTR Drop
        // Compare last 3 days vs prior 7 days
        $recentStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->whereBetween('date', [$threeDaysAgo, $today])
            ->selectRaw('SUM(clicks) as clicks, SUM(impressions) as impressions')
            ->first();

        $baselineStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->whereBetween('date', [$tenDaysAgo, $threeDaysAgo])
            ->selectRaw('SUM(clicks) as clicks, SUM(impressions) as impressions')
            ->first();

        $recentCtr = $recentStats && $recentStats->impressions > 0 ? ($recentStats->clicks / $recentStats->impressions) * 100 : 0;
        $baselineCtr = $baselineStats && $baselineStats->impressions > 0 ? ($baselineStats->clicks / $baselineStats->impressions) * 100 : 0;

        if ($baselineCtr > 0 && $recentCtr < $baselineCtr) {
            $dropPercent = (($baselineCtr - $recentCtr) / $baselineCtr) * 100;
            if ($dropPercent >= 20) {
                $severity = $dropPercent > 40 ? 'critical' : 'warning';
                $anomalies[] = AlertDTO::fromAnomaly([
                    'user_id' => $userId,
                    'campaign_id' => $campaignId,
                    'campaign_name' => $campaign->name,
                    'platform' => $campaign->platform,
                    'severity' => $severity,
                    'alert_type' => 'ctr_drop',
                    'title' => 'CTR Drop Detected',
                    'detail' => "{$campaign->name} CTR fell from " . round($baselineCtr, 2) . "% to " . round($recentCtr, 2) . "% (" . round($dropPercent, 2) . "%) over the last 3 days",
                    'metric_before' => $baselineCtr,
                    'metric_after' => $recentCtr,
                    'percent_change' => -$dropPercent,
                    'triggered_at' => now(),
                ]);
            }
        }

        // Check 2: CPA Spike
        $recentCpaStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->whereBetween('date', [$threeDaysAgo, $today])
            ->selectRaw('SUM(spend) as spend, SUM(conversions) as conversions')
            ->first();

        $baselineCpaStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->whereBetween('date', [$tenDaysAgo, $threeDaysAgo])
            ->selectRaw('SUM(spend) as spend, SUM(conversions) as conversions')
            ->first();

        $recentCpa = $recentCpaStats && $recentCpaStats->conversions > 0 ? $recentCpaStats->spend / $recentCpaStats->conversions : 0;
        $baselineCpa = $baselineCpaStats && $baselineCpaStats->conversions > 0 ? $baselineCpaStats->spend / $baselineCpaStats->conversions : 0;

        if ($baselineCpa > 0 && $recentCpa > $baselineCpa) {
            $spikePercent = (($recentCpa - $baselineCpa) / $baselineCpa) * 100;
            if ($spikePercent >= 25) {
                $severity = $spikePercent > 50 ? 'critical' : 'warning';
                $anomalies[] = AlertDTO::fromAnomaly([
                    'user_id' => $userId,
                    'campaign_id' => $campaignId,
                    'campaign_name' => $campaign->name,
                    'platform' => $campaign->platform,
                    'severity' => $severity,
                    'alert_type' => 'cpa_spike',
                    'title' => "High CPA on " . ucfirst($campaign->platform),
                    'detail' => "Cost per acquisition has spiked " . round($spikePercent, 2) . "% over the last 3 days, now averaging $" . round($recentCpa, 2) . " versus the prior $" . round($baselineCpa, 2),
                    'metric_before' => $baselineCpa,
                    'metric_after' => $recentCpa,
                    'percent_change' => $spikePercent,
                    'triggered_at' => now(),
                ]);
            }
        }

        // Check 3: Conversion Drop
        $lastWeekStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->whereBetween('date', [$lastWeekThreeDaysStart, $lastWeekThreeDaysEnd])
            ->selectRaw('SUM(conversions) as conversions')
            ->first();

        $recentConversions = $recentCpaStats ? $recentCpaStats->conversions : 0;
        $lastWeekConversions = $lastWeekStats ? $lastWeekStats->conversions : 0;

        if ($lastWeekConversions > 0 && $recentConversions < $lastWeekConversions) {
            $dropPercent = (($lastWeekConversions - $recentConversions) / $lastWeekConversions) * 100;
            if ($dropPercent >= 30) {
                $anomalies[] = AlertDTO::fromAnomaly([
                    'user_id' => $userId,
                    'campaign_id' => $campaignId,
                    'campaign_name' => $campaign->name,
                    'platform' => $campaign->platform,
                    'severity' => 'critical',
                    'alert_type' => 'conversion_drop',
                    'title' => 'Conversion Rate Collapse',
                    'detail' => "{$campaign->name} conversions dropped " . round($dropPercent, 2) . "% compared to the same period last week",
                    'metric_before' => $lastWeekConversions,
                    'metric_after' => $recentConversions,
                    'percent_change' => -$dropPercent,
                    'triggered_at' => now(),
                ]);
            }
        }

        // Check 4: Spend Pacing
        $todayStats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->where('date', $today)
            ->first();

        $todaySpend = $todayStats ? $todayStats->spend : 0;
        $adSets = \App\Models\AdSet::where('campaign_id', $campaignId)->get();
        $dailyBudget = 0;
        foreach ($adSets as $adSet) {
            if ($adSet->budget_type === 'daily') {
                $dailyBudget += $adSet->budget_amount;
            }
        }

        if ($dailyBudget > 0) {
            $hourOfDay = $now->hour;
            if ($hourOfDay > 0) {
                $expectedSpend = ($dailyBudget / 24) * $hourOfDay;
                
                if ($hourOfDay >= 20 && $todaySpend < ($dailyBudget * 0.5)) {
                    $spentPercent = ($todaySpend / $dailyBudget) * 100;
                    $anomalies[] = AlertDTO::fromAnomaly([
                        'user_id' => $userId,
                        'campaign_id' => $campaignId,
                        'campaign_name' => $campaign->name,
                        'platform' => $campaign->platform,
                        'severity' => 'info',
                        'alert_type' => 'spend_pacing',
                        'title' => 'Spend Pacing Behind Schedule',
                        'detail' => "{$campaign->name} spent only " . round($spentPercent, 2) . "% of its daily budget by end of day. Bid may be too low to win auctions.",
                        'metric_before' => $dailyBudget,
                        'metric_after' => $todaySpend,
                        'percent_change' => null,
                        'triggered_at' => now(),
                    ]);
                } else if ($hourOfDay <= 12 && $todaySpend >= $dailyBudget) {
                    $anomalies[] = AlertDTO::fromAnomaly([
                        'user_id' => $userId,
                        'campaign_id' => $campaignId,
                        'campaign_name' => $campaign->name,
                        'platform' => $campaign->platform,
                        'severity' => 'critical',
                        'alert_type' => 'budget_exhaustion',
                        'title' => 'Budget Exhaustion Warning',
                        'detail' => "{$campaign->name} is on pace to exhaust its \${$dailyBudget} daily budget early. Consider increasing budget or reviewing bid strategy.",
                        'metric_before' => $dailyBudget,
                        'metric_after' => $todaySpend,
                        'percent_change' => null,
                        'triggered_at' => now(),
                    ]);
                }
            }
        }

        return $anomalies;
    }
}
