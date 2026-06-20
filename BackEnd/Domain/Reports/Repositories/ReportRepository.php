<?php

namespace Domain\Reports\Repositories;

use App\Models\Report;
use Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReportRepository implements ReportRepositoryInterface
{
    public function create(array $data): Report
    {
        return Report::create($data);
    }

    public function find(int $id): ?Report
    {
        return Report::find($id);
    }

    public function update(int $id, array $data): bool
    {
        $report = Report::find($id);
        if ($report) {
            return $report->update($data);
        }
        return false;
    }

    public function findByUserId(int $userId): Collection
    {
        return Report::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }
}
