<?php

namespace App\Domain\CampaignManagement\Repositories;

use App\Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface;
use App\Models\AdSet;
use App\Models\Campaign;
use App\Models\AdSetTargeting;
use App\Models\AdAnalytic;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdSetRepository implements AdSetRepositoryInterface
{
    public function create(array $data, array $targetingData): AdSet
    {
        return DB::transaction(function () use ($data, $targetingData) {
            $adSet = AdSet::create($data);
            
            $targetingData['ad_set_id'] = $adSet->id;
            AdSetTargeting::create($targetingData);
            
            return $adSet->load('targeting');
        });
    }

    public function update(int $id, array $data, array $targetingData, int $userId): AdSet
    {
        $adSet = $this->findByIdAndUser($id, $userId);
        if (!$adSet) {
            abort(404, 'Ad Set not found');
        }

        DB::transaction(function () use ($adSet, $data, $targetingData) {
            $adSet->update($data);
            
            if ($adSet->targeting) {
                $adSet->targeting->update($targetingData);
            } else {
                $targetingData['ad_set_id'] = $adSet->id;
                AdSetTargeting::create($targetingData);
            }
        });

        return $adSet->fresh('targeting');
    }

    public function delete(int $id, int $userId): bool
    {
        $adSet = $this->findByIdAndUser($id, $userId);
        if (!$adSet) {
            abort(404, 'Ad Set not found');
        }
        
        // Soft delete child ads
        foreach ($adSet->ads as $ad) {
            $ad->delete();
        }
        
        return $adSet->delete();
    }

    public function findByIdAndUser(int $id, int $userId): ?AdSet
    {
        return AdSet::where('id', $id)
            ->whereHas('campaign', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['campaign', 'targeting'])
            ->first();
    }

    public function toggleStatus(int $id, int $userId): AdSet
    {
        $adSet = $this->findByIdAndUser($id, $userId);
        if (!$adSet) {
            abort(404, 'Ad Set not found');
        }

        $adSet->status = $adSet->status === 'active' ? 'paused' : 'active';
        $adSet->save();

        return $adSet;
    }

    public function listByCampaign(int $campaignId, int $userId): Collection
    {
        // Verify campaign ownership
        $campaign = Campaign::where('id', $campaignId)->where('user_id', $userId)->first();
        if (!$campaign) {
            abort(404, 'Campaign not found');
        }

        $adSets = AdSet::where('campaign_id', $campaignId)->with('targeting')->get();

        $today = Carbon::today()->toDateString();

        $adSets->map(function ($adSet) use ($today, $campaign) {
            $todayStats = AdAnalytic::where('entity_type', 'ad_set')
                ->where('entity_id', $adSet->id)
                ->where('date', $today)
                ->selectRaw('SUM(spend) as spend_today')
                ->first();

            $totalStats = AdAnalytic::where('entity_type', 'ad_set')
                ->where('entity_id', $adSet->id)
                ->selectRaw('SUM(spend) as total_spend')
                ->first();

            $adSet->spendToday = $todayStats->spend_today ?? 0;
            $adSet->totalSpend = $totalStats->total_spend ?? 0;
            
            // Format for frontend
            $adSet->campaignId = $adSet->campaign_id;
            $adSet->audienceType = ucfirst($adSet->targeting->audience_type ?? 'Broad');
            $adSet->platform = ucfirst($campaign->platform);
            $adSet->budget = $adSet->budget_amount ?? 0;
            $adSet->goal = strtoupper($adSet->optimization_goal ?? 'CONVERSIONS');
            $adSet->sync_status = $adSet->sync_status ?? 'PENDING';
            
            return $adSet;
        });

        return $adSets;
    }
    
    public function aggregateMetricsFromAds(int $adSetId, string $date): void
    {
        $adSet = AdSet::find($adSetId);
        if (!$adSet) return;
        
        $adsIds = $adSet->ads()->pluck('id')->toArray();
        if (empty($adsIds)) return;
        
        $stats = AdAnalytic::where('entity_type', 'ad')
            ->whereIn('entity_id', $adsIds)
            ->where('date', $date)
            ->selectRaw('SUM(spend) as spend, SUM(conversion_value) as conversion_value, SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(conversions) as conversions')
            ->first();
            
        if (!$stats || $stats->spend === null) return;
        
        $derived = \App\Domain\CampaignManagement\Services\MetricsCalculator::calculateDerived(
            (float)$stats->spend, 
            (float)$stats->conversion_value, 
            (int)$stats->impressions, 
            (int)$stats->clicks
        );
        
        AdAnalytic::updateOrCreate(
            [
                'entity_type' => 'ad_set',
                'entity_id' => $adSetId,
                'date' => $date
            ],
            [
                'spend' => $stats->spend,
                'conversion_value' => $stats->conversion_value,
                'impressions' => $stats->impressions,
                'clicks' => $stats->clicks,
                'conversions' => $stats->conversions,
                'ctr' => $derived['ctr'],
                'cpc' => $derived['cpc'],
                'cpm' => $derived['cpm'],
                'roas' => $derived['roas'],
            ]
        );
        
        // Also cascade to campaign
        $this->aggregateMetricsFromAdSets($adSet->campaign_id, $date);
    }
    
    private function aggregateMetricsFromAdSets(int $campaignId, string $date): void
    {
        $adSetsIds = AdSet::where('campaign_id', $campaignId)->pluck('id')->toArray();
        if (empty($adSetsIds)) return;
        
        $stats = AdAnalytic::where('entity_type', 'ad_set')
            ->whereIn('entity_id', $adSetsIds)
            ->where('date', $date)
            ->selectRaw('SUM(spend) as spend, SUM(conversion_value) as conversion_value, SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(conversions) as conversions')
            ->first();
            
        if (!$stats || $stats->spend === null) return;
        
        $derived = \App\Domain\CampaignManagement\Services\MetricsCalculator::calculateDerived(
            (float)$stats->spend, 
            (float)$stats->conversion_value, 
            (int)$stats->impressions, 
            (int)$stats->clicks
        );
        
        AdAnalytic::updateOrCreate(
            [
                'entity_type' => 'campaign',
                'entity_id' => $campaignId,
                'date' => $date
            ],
            [
                'spend' => $stats->spend,
                'conversion_value' => $stats->conversion_value,
                'impressions' => $stats->impressions,
                'clicks' => $stats->clicks,
                'conversions' => $stats->conversions,
                'ctr' => $derived['ctr'],
                'cpc' => $derived['cpc'],
                'cpm' => $derived['cpm'],
                'roas' => $derived['roas'],
            ]
        );
    }
}
