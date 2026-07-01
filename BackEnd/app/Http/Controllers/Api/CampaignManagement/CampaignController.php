<?php

namespace App\Http\Controllers\Api\CampaignManagement;

use App\Http\Controllers\Controller;
use App\Domain\CampaignManagement\Contracts\Services\CampaignServiceInterface;
use App\Domain\CampaignManagement\Requests\StoreCampaignRequest;
use App\Domain\CampaignManagement\Requests\UpdateCampaignRequest;
use App\Domain\CampaignManagement\Requests\RecordDailyLogRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    private CampaignServiceInterface $campaignService;

    public function __construct(CampaignServiceInterface $campaignService)
    {
        $this->campaignService = $campaignService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'platform', 'search']);
        $campaigns = $this->campaignService->list(auth()->id(), $filters);
        
        return response()->json([
            'status' => 'success',
            'data' => $campaigns
        ]);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $campaign = $this->campaignService->create($request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $campaign
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $data = $this->campaignService->getWithDetail($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function update(UpdateCampaignRequest $request, int $id): JsonResponse
    {
        $campaign = $this->campaignService->update($id, $request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $campaign
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->campaignService->delete($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign deleted successfully.'
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $campaign = $this->campaignService->toggleStatus($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $campaign
        ]);
    }

    public function getDailyLogs(int $id): JsonResponse
    {
        $logs = $this->campaignService->getDailyLogs($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }

    public function recordDailyLog(RecordDailyLogRequest $request, int $id): JsonResponse
    {
        $logs = $this->campaignService->recordDailyLog($id, $request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }

    public function updateDailyLog(RecordDailyLogRequest $request, int $id, int $logId): JsonResponse
    {
        $logs = $this->campaignService->updateDailyLog($id, $logId, $request->validated(), auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }

    public function deleteDailyLog(int $id, int $logId): JsonResponse
    {
        $logs = $this->campaignService->deleteDailyLog($id, $logId, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ]);
    }
}
