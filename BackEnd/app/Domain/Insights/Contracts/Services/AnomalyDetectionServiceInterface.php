<?php

namespace App\App\Domain\Insights\Contracts\Services;

interface AnomalyDetectionServiceInterface
{
    public function detectForUser(int $userId): array;
    public function detectForCampaign(int $campaignId, int $userId): array;
}
