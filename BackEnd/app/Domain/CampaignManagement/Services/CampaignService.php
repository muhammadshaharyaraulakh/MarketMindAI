<?php

namespace App\App\Domain\CampaignManagement\Services;

use App\App\Domain\CampaignManagement\Contracts\Repositories\CampaignRepositoryInterface;
use App\App\Domain\CampaignManagement\Contracts\Services\CampaignServiceInterface;
use App\Models\Campaign;
use Illuminate\Support\Collection;
use App\Jobs\SimulateSyncStatusJob;

class CampaignService implements CampaignServiceInterface
{
    protected CampaignRepositoryInterface $campaignRepository;

    public function __construct(CampaignRepositoryInterface $campaignRepository)
    {
        $this->campaignRepository = $campaignRepository;
    }

    public function create(array $data, int $userId): Campaign
    {
        $data['user_id'] = $userId;
        $data['status'] = 'draft';
        
        $adAccount = \App\Models\AdAccount::firstOrCreate(
            ['user_id' => $userId, 'platform' => strtolower($data['platform'])],
            ['account_name' => ucfirst($data['platform']) . ' Main Account', 'status' => 'active']
        );
        $data['ad_account_id'] = $adAccount->id;
        
        $autoSync = $data['auto_sync'] ?? false;
        if ($autoSync) {
            $data['sync_status'] = 'PENDING';
        }

        $campaign = $this->campaignRepository->create($data);

        if ($autoSync) {
            SimulateSyncStatusJob::dispatch('campaign', $campaign->id)->delay(now()->addSeconds(rand(20, 40)));
        }

        return $campaign;
    }

    public function update(int $id, array $data, int $userId): Campaign
    {
        return $this->campaignRepository->update($id, $data, $userId);
    }

    public function delete(int $id, int $userId): bool
    {
        return $this->campaignRepository->delete($id, $userId);
    }

    public function toggleStatus(int $id, int $userId): Campaign
    {
        return $this->campaignRepository->toggleStatus($id, $userId);
    }

    public function list(int $userId, array $filters): Collection
    {
        return $this->campaignRepository->listWithFilters($userId, $filters);
    }

    public function getWithDetail(int $id, int $userId): array
    {
        return $this->campaignRepository->getWithDetail($id, $userId);
    }

    public function recordDailyLog(int $campaignId, array $data, int $userId): array
    {
        return $this->campaignRepository->recordDailyLog($campaignId, $data, $userId);
    }

    public function updateDailyLog(int $campaignId, int $logId, array $data, int $userId): array
    {
        return $this->campaignRepository->updateDailyLog($campaignId, $logId, $data, $userId);
    }

    public function deleteDailyLog(int $campaignId, int $logId, int $userId): array
    {
        return $this->campaignRepository->deleteDailyLog($campaignId, $logId, $userId);
    }

    public function getDailyLogs(int $campaignId, int $userId): array
    {
        return $this->campaignRepository->getDailyLogs($campaignId, $userId);
    }
}
