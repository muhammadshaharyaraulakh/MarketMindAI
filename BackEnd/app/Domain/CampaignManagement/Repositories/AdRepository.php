<?php

namespace App\Domain\CampaignManagement\Repositories;

use App\Domain\CampaignManagement\Contracts\Repositories\AdRepositoryInterface;
use App\Models\Ad;
use App\Models\AdSet;
use App\Models\Campaign;
use App\Models\AdAnalytic;
use Illuminate\Support\Collection;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdRepository implements AdRepositoryInterface
{
    public function create(array $data, array $platformData, string $platform): Ad
    {
        return DB::transaction(function () use ($data, $platformData, $platform) {
            $ad = Ad::create($data);
            
            $platformData['ad_id'] = $ad->id;
            
            if ($platform === 'google') {
                \App\Models\AdGoogleDetail::create($platformData);
            } elseif ($platform === 'meta') {
                \App\Models\AdMetaDetail::create($platformData);
            } elseif ($platform === 'snapchat') {
                \App\Models\AdSnapchatDetail::create($platformData);
            }
            
            return $ad;
        });
    }

    public function update(int $id, array $data, array $platformData, string $platform, int $userId): Ad
    {
        $ad = $this->findByIdAndUser($id, $userId);
        if (!$ad) {
            abort(404, 'Ad not found');
        }

        DB::transaction(function () use ($ad, $data, $platformData, $platform) {
            $ad->update($data);
            
            if ($platform === 'google') {
                \App\Models\AdGoogleDetail::updateOrCreate(['ad_id' => $ad->id], $platformData);
            } elseif ($platform === 'meta') {
                \App\Models\AdMetaDetail::updateOrCreate(['ad_id' => $ad->id], $platformData);
            } elseif ($platform === 'snapchat') {
                \App\Models\AdSnapchatDetail::updateOrCreate(['ad_id' => $ad->id], $platformData);
            }
        });

        return $ad->fresh();
    }

    public function delete(int $id, int $userId): bool
    {
        $ad = $this->findByIdAndUser($id, $userId);
        if (!$ad) {
            abort(404, 'Ad not found');
        }
        
        return $ad->delete();
    }

    public function findByIdAndUser(int $id, int $userId): ?Ad
    {
        return Ad::where('id', $id)
            ->whereHas('adSet.campaign', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->first();
    }

    public function toggleStatus(int $id, int $userId): Ad
    {
        $ad = $this->findByIdAndUser($id, $userId);
        if (!$ad) {
            abort(404, 'Ad not found');
        }

        if (strtolower($ad->review_status) !== 'approved') {
            abort(422, 'Ad must be approved before it can be activated.');
        }

        $ad->status = strtolower($ad->status) === 'active' ? 'paused' : 'active';
        $ad->save();

        return $ad;
    }

    public function resubmit(int $id, array $data, array $platformData, string $platform, int $userId): Ad
    {
        $ad = $this->update($id, $data, $platformData, $platform, $userId);
        
        $ad->review_status = 'PENDING';
        $ad->save();
        
        return $ad;
    }

    public function listByAdSet(int $adSetId, int $userId): Collection
    {
        $adSet = AdSet::where('id', $adSetId)
            ->whereHas('campaign', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with('campaign')
            ->first();
            
        if (!$adSet) {
            abort(404, 'Ad Set not found');
        }

        $ads = Ad::where('ad_set_id', $adSetId)->get();

        $ads->map(function ($ad) use ($adSet) {
            $stats = AdAnalytic::where('entity_type', 'ad')
                ->where('entity_id', $ad->id)
                ->selectRaw('SUM(spend) as total_spend, SUM(impressions) as total_impressions, SUM(clicks) as total_clicks, SUM(conversions) as total_conversions')
                ->first();

            $platform = strtolower($adSet->campaign->platform);
            
            $ad->adSetId = $ad->ad_set_id;
            $ad->format = ucfirst($ad->ad_format ?? 'Responsive');
            $ad->platform = ucfirst($platform);
            $ad->status = ucfirst($ad->status);
            
            if ($platform === 'google') {
                $details = \App\Models\AdGoogleDetail::where('ad_id', $ad->id)->first();
                $ad->headline = $details ? (json_decode($details->headlines)[0] ?? 'Google Ad') : 'Google Ad';
                $ad->description = $details ? (json_decode($details->descriptions)[0] ?? '') : '';
            } elseif ($platform === 'meta') {
                $details = \App\Models\AdMetaDetail::where('ad_id', $ad->id)->first();
                $ad->headline = $details->headline ?? 'Meta Ad';
                $ad->description = $details->primary_text ?? '';
            } elseif ($platform === 'snapchat') {
                $details = \App\Models\AdSnapchatDetail::where('ad_id', $ad->id)->first();
                $ad->headline = $details->headline ?? 'Snapchat Ad';
                $ad->brandName = $details->brand_name ?? '';
            }
            
            $ad->metrics = [
                'impressions' => (int)($stats->total_impressions ?? 0),
                'clicks' => (int)($stats->total_clicks ?? 0),
                'spend' => round((float)($stats->total_spend ?? 0), 2),
                'conversions' => (int)($stats->total_conversions ?? 0)
            ];
            
            $ad->cta_type = strtoupper($ad->cta_type ?? 'LEARN_MORE');
            $ad->review_status = strtoupper($ad->review_status ?? 'PENDING');
            
            return $ad;
        });

        return $ads;
    }
    
    public function recordMetrics(int $id, array $data, int $userId): array
    {
        $ad = $this->findByIdAndUser($id, $userId);
        if (!$ad) {
            abort(404, 'Ad not found');
        }

        $date = $data['date'] ?? Carbon::today()->toDateString();
        
        $derived = \App\Domain\CampaignManagement\Services\MetricsCalculator::calculateDerived(
            $data['spend'], 
            $data['revenue'] ?? 0, 
            $data['impressions'], 
            $data['clicks']
        );

        AdAnalytic::updateOrCreate(
            [
                'entity_type' => 'ad',
                'entity_id' => $id,
                'date' => $date
            ],
            [
                'spend' => $data['spend'],
                'conversion_value' => $data['revenue'] ?? 0,
                'impressions' => $data['impressions'],
                'clicks' => $data['clicks'],
                'conversions' => $data['conversions'] ?? 0,
                'ctr' => $derived['ctr'],
                'cpc' => $derived['cpc'],
                'cpm' => $derived['cpm'],
                'roas' => $derived['roas'],
                'currency' => 'USD',
            ]
        );

        // Aggregate up to AdSet and Campaign level
        $adSetRepository = app(\App\Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface::class);
        $adSetRepository->aggregateMetricsFromAds($ad->ad_set_id, $date);

        return ['status' => 'success', 'message' => 'Metrics recorded successfully.'];
    }
}
