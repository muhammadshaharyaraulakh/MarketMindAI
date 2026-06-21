<?php

namespace Domain\CampaignManagement\Services;

use Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface;
use Domain\CampaignManagement\Contracts\Services\AdSetServiceInterface;
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
        return $this->adSetRepository->create($data, $targetingData);
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
