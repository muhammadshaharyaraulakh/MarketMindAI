<?php

namespace Domain\CampaignManagement\Contracts\Services;

use App\Models\Campaign;
use Illuminate\Support\Collection;

interface CampaignServiceInterface
{
    public function create(array $data, int $userId): Campaign;
    public function update(int $id, array $data, int $userId): Campaign;
    public function delete(int $id, int $userId): bool;
    public function toggleStatus(int $id, int $userId): Campaign;
    public function list(int $userId, array $filters): Collection;
    public function getWithDetail(int $id, int $userId): array;
    public function recordDailyLog(int $campaignId, array $data, int $userId): array;
    public function updateDailyLog(int $campaignId, int $logId, array $data, int $userId): array;
    public function deleteDailyLog(int $campaignId, int $logId, int $userId): array;
    public function getDailyLogs(int $campaignId, int $userId): array;
}
