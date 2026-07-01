<?php

namespace App\Domain\Insights\Repositories;

use App\Models\Recommendation;
use App\Models\Alert;
use App\Domain\Insights\Contracts\Repositories\RecommendationRepositoryInterface;
use App\Domain\Insights\DTOs\RecommendationDTO;

class RecommendationRepository implements RecommendationRepositoryInterface
{
    public function create(RecommendationDTO $dto): Recommendation
    {
        return Recommendation::create([
            'alert_id' => $dto->alertId,
            'recommendation_text' => $dto->recommendationText,
            'category' => $dto->category,
            'generated_via_ai' => $dto->generatedViaAi,
        ]);
    }

    public function markApplied(int $id, int $userId): bool
    {
        $recommendation = Recommendation::find($id);
        if (!$recommendation) return false;

        $alert = Alert::where('id', $recommendation->alert_id)->where('user_id', $userId)->first();
        if ($alert) {
            $recommendation->update(['applied' => true]);
            return true;
        }
        return false;
    }

    public function markDismissed(int $id, int $userId): bool
    {
        $recommendation = Recommendation::find($id);
        if (!$recommendation) return false;

        $alert = Alert::where('id', $recommendation->alert_id)->where('user_id', $userId)->first();
        if ($alert) {
            $recommendation->update(['dismissed' => true]);
            return true;
        }
        return false;
    }
}
