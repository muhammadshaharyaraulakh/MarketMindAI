<?php

namespace App\Http\Controllers\Api\CampaignManagement;

use App\Http\Controllers\Controller;
use Domain\CampaignManagement\Contracts\Services\AdSetServiceInterface;
use Domain\CampaignManagement\Requests\StoreAdSetRequest;
use Domain\CampaignManagement\Requests\UpdateAdSetRequest;
use Illuminate\Http\JsonResponse;

class AdSetController extends Controller
{
    private AdSetServiceInterface $adSetService;

    public function __construct(AdSetServiceInterface $adSetService)
    {
        $this->adSetService = $adSetService;
    }

    public function index(int $campaignId): JsonResponse
    {
        $adSets = $this->adSetService->listByCampaign($campaignId, auth()->id());
        
        return response()->json([
            'status' => 'success',
            'data' => $adSets
        ]);
    }

    public function store(StoreAdSetRequest $request): JsonResponse
    {
        $data = $request->only(['campaign_id', 'name', 'status', 'optimization_goal', 'billing_event', 'budget_type', 'budget_amount', 'start_time', 'end_time', 'placements']);
        $targetingData = $request->only(['audience_type', 'age_min', 'age_max', 'locations', 'interests', 'genders']);
        
        $adSet = $this->adSetService->create($data, $targetingData, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $adSet
        ], 201);
    }

    public function update(UpdateAdSetRequest $request, int $id): JsonResponse
    {
        $data = $request->only(['campaign_id', 'name', 'status', 'optimization_goal', 'billing_event', 'budget_type', 'budget_amount', 'start_time', 'end_time', 'placements']);
        $targetingData = $request->only(['audience_type', 'age_min', 'age_max', 'locations', 'interests', 'genders']);

        $adSet = $this->adSetService->update($id, $data, $targetingData, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $adSet
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->adSetService->delete($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Ad Set deleted successfully.'
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $adSet = $this->adSetService->toggleStatus($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $adSet
        ]);
    }
}
