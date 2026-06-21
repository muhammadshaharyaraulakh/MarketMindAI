<?php

namespace Domain\Insights\Repositories;

use App\Models\Alert;
use Domain\Insights\Contracts\Repositories\AlertRepositoryInterface;
use Domain\Insights\DTOs\AlertDTO;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class AlertRepository implements AlertRepositoryInterface
{
    public function create(AlertDTO $dto): Alert
    {
        return Alert::create([
            'user_id' => $dto->userId,
            'campaign_id' => $dto->campaignId,
            'campaign_name' => $dto->campaignName,
            'platform' => $dto->platform,
            'severity' => $dto->severity,
            'alert_type' => $dto->alertType,
            'title' => $dto->title,
            'detail' => $dto->detail,
            'metric_before' => $dto->metricBefore,
            'metric_after' => $dto->metricAfter,
            'percent_change' => $dto->percentChange,
            'triggered_at' => $dto->triggeredAt,
        ]);
    }

    public function findRecentDuplicate(int $userId, int $campaignId, string $alertType): ?Alert
    {
        return Alert::where('user_id', $userId)
            ->where('campaign_id', $campaignId)
            ->where('alert_type', $alertType)
            ->where('status', 'active')
            ->where('triggered_at', '>=', Carbon::now()->subHours(24))
            ->first();
    }

    public function updateMetrics(Alert $alert, AlertDTO $dto): Alert
    {
        $alert->update([
            'metric_before' => $dto->metricBefore,
            'metric_after' => $dto->metricAfter,
            'percent_change' => $dto->percentChange,
            'detail' => $dto->detail,
            'triggered_at' => $dto->triggeredAt,
        ]);
        return $alert;
    }

    public function listForUser(int $userId, ?string $severity = null): Collection
    {
        $query = Alert::where('user_id', $userId)
            ->where('status', 'active');

        if ($severity) {
            $query->where('severity', $severity);
        }

        return $query->orderBy('triggered_at', 'desc')->get();
    }

    public function dismiss(int $id, int $userId): bool
    {
        $alert = Alert::where('id', $id)->where('user_id', $userId)->first();
        if ($alert) {
            $alert->update(['status' => 'dismissed']);
            return true;
        }
        return false;
    }

    public function countBySeverity(int $userId): array
    {
        $counts = Alert::where('user_id', $userId)
            ->where('status', 'active')
            ->selectRaw('severity, count(*) as count')
            ->groupBy('severity')
            ->pluck('count', 'severity')
            ->toArray();

        return [
            'critical' => $counts['critical'] ?? 0,
            'warning' => $counts['warning'] ?? 0,
            'info' => $counts['info'] ?? 0,
        ];
    }
}
