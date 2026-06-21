<?php

namespace Domain\Insights\DTOs;

class RecommendationDTO
{
    public function __construct(
        public int $alertId,
        public string $recommendationText,
        public string $category,
        public bool $generatedViaAi = true
    ) {
    }
}
