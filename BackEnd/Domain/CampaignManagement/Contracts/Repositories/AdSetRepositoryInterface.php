<?php

namespace Domain\CampaignManagement\Contracts\Repositories;

use Illuminate\Support\Collection;
use App\Models\AdSet;

interface AdSetRepositoryInterface
{
    public function create(array $data, array $targetingData): AdSet;
    public function update(int $id, array $data, array $targetingData, int $userId): AdSet;
    public function delete(int $id, int $userId): bool;
    public function findByIdAndUser(int $id, int $userId): ?AdSet;
    public function toggleStatus(int $id, int $userId): AdSet;
    public function listByCampaign(int $campaignId, int $userId): Collection;
    public function aggregateMetricsFromAds(int $adSetId, string $date): void;
}
