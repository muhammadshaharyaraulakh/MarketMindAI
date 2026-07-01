<?php

namespace App\App\Domain\DataIngestion\Contracts\Services;

use App\Models\Campaign;

interface PineconeServiceInterface
{
    public function generateCampaignSummary(Campaign $campaign): string;
    public function embedText(string $text): array;
    public function upsertCampaign(Campaign $campaign, int $userId): bool;
    public function upsertAllCampaigns(array $campaignIds, int $userId): void;
}
