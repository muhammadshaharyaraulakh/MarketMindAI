<?php

namespace Domain\Reports\Contracts\Repositories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Collection;

interface ReportRepositoryInterface
{
    public function create(array $data): Report;
    public function find(int $id): ?Report;
    public function update(int $id, array $data): bool;
    public function findByUserId(int $userId): Collection;
}
