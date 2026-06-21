<?php

namespace Domain\Insights\Contracts\Services;

use App\Models\Alert;
use App\Models\Recommendation;

interface InsightsPineconeServiceInterface
{
    public function upsertAlert(Alert $alert, Recommendation $recommendation, int $userId): bool;
}
