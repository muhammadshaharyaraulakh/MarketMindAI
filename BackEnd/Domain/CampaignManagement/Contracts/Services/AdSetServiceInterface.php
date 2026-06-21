<?php

namespace Domain\CampaignManagement\Contracts\Services;

use App\Models\AdSet;
use Illuminate\Support\Collection;

interface AdSetServiceInterface
{
    public function create(array $data, array $targetingData, int $userId): AdSet;
    public function update(int $id, array $data, array $targetingData, int $userId): AdSet;
    public function delete(int $id, int $userId): bool;
    public function toggleStatus(int $id, int $userId): AdSet;
    public function listByCampaign(int $campaignId, int $userId): Collection;
}
