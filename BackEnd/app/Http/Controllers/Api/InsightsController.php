<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Recommendation;
use Domain\Insights\Contracts\Repositories\AlertRepositoryInterface;
use Domain\Insights\Contracts\Repositories\RecommendationRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InsightsController extends Controller
{
    public function index(Request $request, AlertRepositoryInterface $alertRepo): JsonResponse
    {
        $userId = auth()->id();
        $severity = $request->query('severity');

        $alerts = $alertRepo->listForUser($userId, $severity);
        $alerts->load('recommendation');

        $severityCounts = $alertRepo->countBySeverity($userId);

        $lastAnalyzed = Alert::where('user_id', $userId)->max('triggered_at');

        return response()->json([
            'alerts' => $alerts,
            'severity_counts' => $severityCounts,
            'last_analyzed' => $lastAnalyzed
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        dispatch(new \App\Jobs\DetectAnomaliesJob(auth()->id()));

        return response()->json([
            'success' => true,
            'message' => 'Refreshing insights...',
            'job_dispatched' => true
        ]);
    }

    public function dismiss(Request $request, int $id, AlertRepositoryInterface $alertRepo): JsonResponse
    {
        $success = $alertRepo->dismiss($id, auth()->id());
        if (!$success) {
            return response()->json(['error' => 'Not found or unauthorized'], 404);
        }
        return response()->json(['success' => true]);
    }

    public function applyRecommendation(Request $request, int $id, RecommendationRepositoryInterface $recRepo): JsonResponse
    {
        $success = $recRepo->markApplied($id, auth()->id());
        if (!$success) {
            return response()->json(['error' => 'Not found or unauthorized'], 404);
        }
        return response()->json(['success' => true]);
    }

    public function dismissRecommendation(Request $request, int $id, RecommendationRepositoryInterface $recRepo): JsonResponse
    {
        $success = $recRepo->markDismissed($id, auth()->id());
        if (!$success) {
            return response()->json(['error' => 'Not found or unauthorized'], 404);
        }
        return response()->json(['success' => true]);
    }
}
