<?php

namespace App\App\Domain\CampaignManagement\Services;

use App\App\Domain\CampaignManagement\Contracts\Repositories\AdRepositoryInterface;
use App\App\Domain\CampaignManagement\Contracts\Services\AdServiceInterface;
use App\Models\Ad;
use Illuminate\Support\Collection;
use App\Jobs\SimulateSyncStatusJob;

class AdService implements AdServiceInterface
{
    protected AdRepositoryInterface $adRepository;

    public function __construct(AdRepositoryInterface $adRepository)
    {
        $this->adRepository = $adRepository;
    }

    public function create(array $data, array $platformData, string $platform, int $userId): Ad
    {
        $data['status'] = 'draft';
        $data['review_status'] = 'PENDING';
        
        $ad = $this->adRepository->create($data, $platformData, $platform);
        
        SimulateSyncStatusJob::dispatch('ad', $ad->id)->delay(now()->addSeconds(rand(20, 40)));

        return $ad;
    }

    public function update(int $id, array $data, array $platformData, string $platform, int $userId): Ad
    {
        return $this->adRepository->update($id, $data, $platformData, $platform, $userId);
    }

    public function delete(int $id, int $userId): bool
    {
        return $this->adRepository->delete($id, $userId);
    }

    public function toggleStatus(int $id, int $userId): Ad
    {
        return $this->adRepository->toggleStatus($id, $userId);
    }

    public function resubmit(int $id, array $data, array $platformData, string $platform, int $userId): Ad
    {
        $ad = $this->adRepository->resubmit($id, $data, $platformData, $platform, $userId);
        
        SimulateSyncStatusJob::dispatch('ad', $ad->id)->delay(now()->addSeconds(rand(20, 40)));

        return $ad;
    }

    public function listByAdSet(int $adSetId, int $userId): Collection
    {
        return $this->adRepository->listByAdSet($adSetId, $userId);
    }
    
    public function recordMetrics(int $id, array $data, int $userId): array
    {
        return $this->adRepository->recordMetrics($id, $data, $userId);
    }
}
