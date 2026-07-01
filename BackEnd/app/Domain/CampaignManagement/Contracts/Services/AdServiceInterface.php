<?php

namespace App\App\Domain\CampaignManagement\Contracts\Services;

use App\Models\Ad;
use Illuminate\Support\Collection;

interface AdServiceInterface
{
    public function create(array $data, array $platformData, string $platform, int $userId): Ad;
    public function update(int $id, array $data, array $platformData, string $platform, int $userId): Ad;
    public function delete(int $id, int $userId): bool;
    public function toggleStatus(int $id, int $userId): Ad;
    public function resubmit(int $id, array $data, array $platformData, string $platform, int $userId): Ad;
    public function listByAdSet(int $adSetId, int $userId): Collection;
    public function recordMetrics(int $id, array $data, int $userId): array;
}
