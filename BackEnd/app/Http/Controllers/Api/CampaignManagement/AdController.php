<?php

namespace App\Http\Controllers\Api\CampaignManagement;

use App\Http\Controllers\Controller;
use App\Domain\CampaignManagement\Contracts\Services\AdServiceInterface;
use App\Domain\CampaignManagement\Requests\StoreAdRequest;
use App\Domain\CampaignManagement\Requests\UpdateAdRequest;
use App\Domain\CampaignManagement\Requests\RecordDailyLogRequest;
use Illuminate\Http\JsonResponse;
use App\Models\AdSet;

class AdController extends Controller
{
    private AdServiceInterface $adService;

    public function __construct(AdServiceInterface $adService)
    {
        $this->adService = $adService;
    }

    public function index(int $adSetId): JsonResponse
    {
        $ads = $this->adService->listByAdSet($adSetId, auth()->id());
        
        return response()->json([
            'status' => 'success',
            'data' => $ads
        ]);
    }

    private function getPlatformFields(string $platform): array
    {
        if ($platform === 'google') return ['headlines', 'descriptions'];
        if ($platform === 'meta') return ['primary_text', 'headline', 'link_description', 'page_id', 'instagram_placement'];
        if ($platform === 'snapchat') return ['brand_name', 'headline', 'attachment_url'];
        return [];
    }

    public function store(StoreAdRequest $request): JsonResponse
    {
        $adSet = AdSet::with('campaign')->find($request->ad_set_id);
        $platform = strtolower($adSet->campaign->platform);

        $platformFields = $this->getPlatformFields($platform);
        $data = $request->only(['ad_set_id', 'name', 'status', 'ad_format', 'headline', 'description', 'destination_url', 'cta_type', 'ab_test_group', 'url_custom_parameters', 'sync_status']);
        $platformData = $request->only($platformFields);


        // Normalize platform data
        if ($platform === 'google') {
            $platformData['headlines'] = isset($platformData['headlines']) ? json_encode($platformData['headlines']) : json_encode([]);
            $platformData['descriptions'] = isset($platformData['descriptions']) ? json_encode($platformData['descriptions']) : json_encode([]);
        }

        $ad = $this->adService->create($data, $platformData, $platform, auth()->id());

        // Handle initial metrics if provided
        if ($request->filled('initial_spend') || $request->filled('initial_impressions')) {
            $this->adService->recordMetrics($ad->id, [
                'date' => \Carbon\Carbon::today()->toDateString(),
                'spend' => $request->input('initial_spend', 0),
                'impressions' => $request->input('initial_impressions', 0),
                'clicks' => $request->input('initial_clicks', 0),
                'conversions' => $request->input('initial_conversions', 0),
            ], auth()->id());
        }

        return response()->json([
            'status' => 'success',
            'data' => $ad
        ], 201);
    }

    public function update(UpdateAdRequest $request, int $id): JsonResponse
    {
        $ad = \App\Models\Ad::with('adSet.campaign')->find($id);
        $platform = strtolower($ad->adSet->campaign->platform);

        $platformFields = $this->getPlatformFields($platform);
        $data = $request->only(['ad_set_id', 'name', 'status', 'ad_format', 'headline', 'description', 'destination_url', 'cta_type', 'ab_test_group', 'url_custom_parameters', 'sync_status']);
        $platformData = $request->only($platformFields);

        if ($platform === 'google') {
            if (isset($platformData['headlines'])) {
                $platformData['headlines'] = json_encode($platformData['headlines']);
            }
            if (isset($platformData['descriptions'])) {
                $platformData['descriptions'] = json_encode($platformData['descriptions']);
            }
        }

        $updatedAd = $this->adService->update($id, $data, $platformData, $platform, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $updatedAd
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->adService->delete($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'message' => 'Ad deleted successfully.'
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $ad = $this->adService->toggleStatus($id, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $ad
        ]);
    }

    public function resubmit(UpdateAdRequest $request, int $id): JsonResponse
    {
        $ad = \App\Models\Ad::with('adSet.campaign')->find($id);
        $platform = strtolower($ad->adSet->campaign->platform);

        $platformFields = $this->getPlatformFields($platform);
        $data = $request->only(['ad_set_id', 'name', 'status', 'ad_format', 'headline', 'description', 'destination_url', 'cta_type', 'ab_test_group', 'url_custom_parameters', 'sync_status']);
        $platformData = $request->only($platformFields);

        if ($platform === 'google') {
            if (isset($platformData['headlines'])) {
                $platformData['headlines'] = json_encode($platformData['headlines']);
            }
            if (isset($platformData['descriptions'])) {
                $platformData['descriptions'] = json_encode($platformData['descriptions']);
            }
        }

        $updatedAd = $this->adService->resubmit($id, $data, $platformData, $platform, auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $updatedAd
        ]);
    }

    public function recordMetrics(RecordDailyLogRequest $request, int $id): JsonResponse
    {
        $result = $this->adService->recordMetrics($id, $request->validated(), auth()->id());

        return response()->json($result);
    }
}
