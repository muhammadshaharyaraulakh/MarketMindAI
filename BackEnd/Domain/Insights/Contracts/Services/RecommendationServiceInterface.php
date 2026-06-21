<?php

namespace Domain\Insights\Contracts\Services;

use App\Models\Alert;
use Domain\Insights\DTOs\RecommendationDTO;

interface RecommendationServiceInterface
{
    public function generateForAlert(Alert $alert): RecommendationDTO;
}
