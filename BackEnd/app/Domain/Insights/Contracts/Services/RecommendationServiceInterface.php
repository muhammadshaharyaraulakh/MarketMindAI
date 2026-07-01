<?php

namespace App\Domain\Insights\Contracts\Services;

use App\Models\Alert;
use App\Domain\Insights\DTOs\RecommendationDTO;

interface RecommendationServiceInterface
{
    public function generateForAlert(Alert $alert): RecommendationDTO;
}
