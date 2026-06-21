<?php

namespace Domain\Insights\Contracts\Repositories;

use App\Models\Alert;
use Domain\Insights\DTOs\AlertDTO;
use Illuminate\Database\Eloquent\Collection;

interface AlertRepositoryInterface
{
    public function create(AlertDTO $dto): Alert;
    public function findRecentDuplicate(int $userId, int $campaignId, string $alertType): ?Alert;
    public function updateMetrics(Alert $alert, AlertDTO $dto): Alert;
    public function listForUser(int $userId, ?string $severity): Collection;
    public function dismiss(int $id, int $userId): bool;
    public function countBySeverity(int $userId): array;
}
