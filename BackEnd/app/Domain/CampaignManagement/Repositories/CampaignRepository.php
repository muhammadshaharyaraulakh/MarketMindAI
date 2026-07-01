<?php

namespace App\Domain\CampaignManagement\Repositories;

use App\Domain\CampaignManagement\Contracts\Repositories\CampaignRepositoryInterface;
use App\Models\Campaign;
use App\Models\AdAnalytic;
use App\Domain\CampaignManagement\Services\MetricsCalculator;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class CampaignRepository implements CampaignRepositoryInterface
{
    public function create(array $data): Campaign
    {
        return Campaign::create($data);
    }

    public function update(int $id, array $data, int $userId): Campaign
    {
        $campaign = $this->findByIdAndUser($id, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }
        $campaign->update($data);
        return $campaign->fresh();
    }

    public function delete(int $id, int $userId): bool
    {
        $campaign = $this->findByIdAndUser($id, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }
        
        // Soft delete child ad sets
        foreach ($campaign->adSets as $adSet) {
            foreach ($adSet->ads as $ad) {
                $ad->delete();
            }
            $adSet->delete();
        }
        
        return $campaign->delete();
    }

    public function findByIdAndUser(int $id, int $userId): ?Campaign
    {
        return Campaign::where('id', $id)->where('user_id', $userId)->first();
    }

    public function toggleStatus(int $id, int $userId): Campaign
    {
        $campaign = $this->findByIdAndUser($id, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        $campaign->status = $campaign->status === 'active' ? 'paused' : 'active';
        $campaign->save();

        return $campaign;
    }

    public function listWithFilters(int $userId, array $filters): Collection
    {
        $query = Campaign::where('user_id', $userId);

        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $query->where('status', strtolower($filters['status']));
        }

        if (!empty($filters['platform']) && $filters['platform'] !== 'All') {
            $query->where('platform', strtolower($filters['platform']));
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%');
        }

        $campaigns = $query->get();

        // Attach aggregated stats
        $campaigns->map(function ($campaign) {
            $stats = AdAnalytic::where('entity_type', 'campaign')
                ->where('entity_id', $campaign->id)
                ->selectRaw('SUM(spend) as total_spend, SUM(conversion_value) as total_revenue, SUM(impressions) as impressions, SUM(clicks) as clicks')
                ->first();

            $campaign->totalSpend = $stats->total_spend ?? 0;
            $campaign->totalRevenue = $stats->total_revenue ?? 0;
            $campaign->roas = $campaign->totalSpend > 0 ? $campaign->totalRevenue / $campaign->totalSpend : 0;
            $campaign->ctr = ($stats->impressions ?? 0) > 0 ? (($stats->clicks ?? 0) / $stats->impressions) * 100 : 0;
            $campaign->budget = $campaign->budget_amount;
            
            $campaign->platform = ucfirst($campaign->platform);
            $campaign->status = ucfirst($campaign->status);
            
            return $campaign;
        });

        return $campaigns;
    }

    public function getWithDetail(int $id, int $userId): array
    {
        $campaign = $this->findByIdAndUser($id, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        $stats = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaign->id)
            ->selectRaw('SUM(spend) as total_spend, SUM(conversion_value) as total_revenue, SUM(conversions) as total_conversions')
            ->first();

        $campaignData = $campaign->toArray();
        $campaignData['metrics'] = [
            'spend' => $stats->total_spend ?? 0,
            'revenue' => $stats->total_revenue ?? 0,
            'roas' => ($stats->total_spend ?? 0) > 0 ? ($stats->total_revenue ?? 0) / ($stats->total_spend ?? 0) : 0,
            'conversions' => $stats->total_conversions ?? 0,
        ];

        $trendData = AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaign->id)
            ->orderBy('date')
            ->get(['date', 'spend', 'conversion_value as revenue'])
            ->toArray();

        return [
            'campaign' => $campaignData,
            'trend' => $trendData,
        ];
    }

    public function recordDailyLog(int $campaignId, array $data, int $userId): array
    {
        $campaign = $this->findByIdAndUser($campaignId, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        $derived = MetricsCalculator::calculateDerived(
            $data['spend'], 
            $data['revenue'], 
            $data['impressions'], 
            $data['clicks']
        );

        AdAnalytic::updateOrCreate(
            [
                'entity_type' => 'campaign',
                'entity_id' => $campaignId,
                'date' => $data['date']
            ],
            [
                'spend' => $data['spend'],
                'conversion_value' => $data['revenue'],
                'impressions' => $data['impressions'],
                'clicks' => $data['clicks'],
                'conversions' => $data['leads'],
                'ctr' => $derived['ctr'],
                'cpc' => $derived['cpc'],
                'cpm' => $derived['cpm'],
                'roas' => $derived['roas'],
                'platform' => $campaign->platform,
            ]
        );

        return $this->getDailyLogs($campaignId, $userId);
    }

    public function updateDailyLog(int $campaignId, int $logId, array $data, int $userId): array
    {
        $campaign = $this->findByIdAndUser($campaignId, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        $log = AdAnalytic::where('id', $logId)
            ->where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->firstOrFail();

        $derived = MetricsCalculator::calculateDerived(
            $data['spend'], 
            $data['revenue'], 
            $data['impressions'], 
            $data['clicks']
        );

        $log->update([
            'date' => $data['date'],
            'spend' => $data['spend'],
            'conversion_value' => $data['revenue'],
            'impressions' => $data['impressions'],
            'clicks' => $data['clicks'],
            'conversions' => $data['leads'],
            'ctr' => $derived['ctr'],
            'cpc' => $derived['cpc'],
            'cpm' => $derived['cpm'],
            'roas' => $derived['roas'],
            'platform' => $campaign->platform,
        ]);

        return $this->getDailyLogs($campaignId, $userId);
    }

    public function deleteDailyLog(int $campaignId, int $logId, int $userId): array
    {
        $campaign = $this->findByIdAndUser($campaignId, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        AdAnalytic::where('id', $logId)
            ->where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->delete();

        return $this->getDailyLogs($campaignId, $userId);
    }

    public function getDailyLogs(int $campaignId, int $userId): array
    {
        $campaign = $this->findByIdAndUser($campaignId, $userId);
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        return AdAnalytic::where('entity_type', 'campaign')
            ->where('entity_id', $campaignId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'campaignId' => $log->entity_id,
                    'date' => $log->date,
                    'spend' => (float)$log->spend,
                    'revenue' => (float)$log->conversion_value,
                    'impressions' => (int)$log->impressions,
                    'clicks' => (int)$log->clicks,
                    'leads' => (int)$log->conversions,
                    'roas' => (float)$log->roas
                ];
            })
            ->toArray();
    }
}
