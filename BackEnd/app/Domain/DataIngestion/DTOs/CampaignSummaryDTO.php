<?php

namespace App\Domain\DataIngestion\DTOs;

class CampaignSummaryDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $platform,
        public string $objective,
        public float $totalSpend,
        public float $totalRevenue,
        public float $averageRoas,
        public int $totalClicks,
        public int $totalImpressions,
        public int $totalConversions,
        public ?string $dateRangeStart,
        public ?string $dateRangeEnd,
        public int $adSetCount,
        public int $adCount,
        public string $createdAt
    ) {}
}
