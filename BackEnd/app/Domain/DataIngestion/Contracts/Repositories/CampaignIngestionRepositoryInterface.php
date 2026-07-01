<?php

namespace App\App\Domain\DataIngestion\Contracts\Repositories;

use Illuminate\Support\Collection;

interface CampaignIngestionRepositoryInterface
{
    public function getCompletedCampaigns(int $userId): Collection;
    public function getCampaignWithStats(int $campaignId, int $userId): ?array;
}
