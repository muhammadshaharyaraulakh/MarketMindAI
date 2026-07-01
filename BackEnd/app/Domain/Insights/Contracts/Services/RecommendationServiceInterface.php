<?php

namespace App\App\Domain\Insights\Contracts\Services;

use App\Models\Alert;
use App\App\Domain\Insights\DTOs\RecommendationDTO;

interface RecommendationServiceInterface
{
    public function generateForAlert(Alert $alert): RecommendationDTO;
}
