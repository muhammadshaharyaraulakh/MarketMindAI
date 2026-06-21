<?php

namespace Domain\Insights\Contracts\Repositories;

use App\Models\Recommendation;
use Domain\Insights\DTOs\RecommendationDTO;

interface RecommendationRepositoryInterface
{
    public function create(RecommendationDTO $dto): Recommendation;
    public function markApplied(int $id, int $userId): bool;
    public function markDismissed(int $id, int $userId): bool;
}
