<?php

namespace App\Domain\CampaignManagement\Services;

use App\Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface;
use App\Domain\CampaignManagement\Contracts\Services\AdSetServiceInterface;
use App\Models\AdSet;
use Illuminate\Support\Collection;

class AdSetService implements AdSetServiceInterface
{
    protected AdSetRepositoryInterface $adSetRepository;

    public function __construct(AdSetRepositoryInterface $adSetRepository)
    {
        $this->adSetRepository = $adSetRepository;
    }

    public function create(array $data, array $targetingData, int $userId): AdSet
    {
        $data['status'] = 'draft';
        $adSet = $this->adSetRepository->create($data, $targetingData);
        
        // --- Demo Logging for Presentation ---
        \Illuminate\Support\Facades\Log::info("Initiating API Request for Ad Set Creation", [
            'endpoint' => "https://api.sandbox.platform.com/v1/ad_sets",
            'payload' => array_merge($data, $targetingData)
        ]);
        
        \Illuminate\Support\Facades\Log::info("API Response (Simulated 200 OK)", [
            'status' => 200,
            'results' => ['id' => rand(100000, 999999), 'status' => 'ACTIVE']
        ]);
        // -------------------------------------
        
        \App\Jobs\SimulateSyncStatusJob::dispatch('ad_set', $adSet->id)->delay(now()->addSeconds(rand(5, 10)));
        
        return $adSet;
    }

    public function update(int $id, array $data, array $targetingData, int $userId): AdSet
    {
        return $this->adSetRepository->update($id, $data, $targetingData, $userId);
    }

    public function delete(int $id, int $userId): bool
    {
        return $this->adSetRepository->delete($id, $userId);
    }

    public function toggleStatus(int $id, int $userId): AdSet
    {
        return $this->adSetRepository->toggleStatus($id, $userId);
    }

    public function listByCampaign(int $campaignId, int $userId): Collection
    {
        return $this->adSetRepository->listByCampaign($campaignId, $userId);
    }
}
