<?php

namespace App\App\Domain\Overview\Contracts\Services;

interface OverviewServiceInterface
{
    public function getKpiCards(): array;
    public function getRevenueSpendTrend(): array;
    public function getPlatformAttribution(): array;
    public function getPlatformEfficiency(): array;
    public function getCpaTrend(): array;
}
