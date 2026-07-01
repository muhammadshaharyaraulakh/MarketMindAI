<?php

namespace App\App\Domain\Reports\Contracts\Services;

interface ReportDataServiceInterface
{
    public function getCampaignOverview(int $campaignId): array;
    public function getKpiScorecard(int $campaignId): array;
    public function getDailyTrend(int $campaignId): array;
    public function getAdSetBreakdown(int $campaignId): array;
    public function getAdCreativeBreakdown(int $campaignId): array;
    public function getPlatformBreakdown(int $campaignId): array;
    public function getTopPerformers(int $campaignId): array;
    public function getDayOfWeekPerformance(int $campaignId): array;
    public function getConversionFunnel(int $campaignId): array;
}
