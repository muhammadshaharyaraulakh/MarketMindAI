<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Overview\Contracts\Services\OverviewServiceInterface;
use Illuminate\Http\JsonResponse;

class OverviewController extends Controller
{
    private OverviewServiceInterface $overviewService;

    public function __construct(OverviewServiceInterface $overviewService)
    {
        $this->overviewService = $overviewService;
    }

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'kpi_cards' => $this->overviewService->getKpiCards(),
            'revenue_spend_trend' => $this->overviewService->getRevenueSpendTrend(),
            'platform_attribution' => $this->overviewService->getPlatformAttribution(),
            'platform_efficiency' => $this->overviewService->getPlatformEfficiency(),
            'cpa_trend' => $this->overviewService->getCpaTrend()
        ]);
    }
}
