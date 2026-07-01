<?php

namespace App\Domain\Insights\DTOs;

class AlertDTO
{
    public function __construct(
        public int $userId,
        public int $campaignId,
        public string $campaignName,
        public string $platform,
        public string $severity,
        public string $alertType,
        public string $title,
        public string $detail,
        public ?float $metricBefore,
        public ?float $metricAfter,
        public ?float $percentChange,
        public string $triggeredAt
    ) {
    }

    public static function fromAnomaly(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            campaignId: $data['campaign_id'],
            campaignName: $data['campaign_name'],
            platform: $data['platform'],
            severity: $data['severity'],
            alertType: $data['alert_type'],
            title: $data['title'],
            detail: $data['detail'],
            metricBefore: $data['metric_before'] ?? null,
            metricAfter: $data['metric_after'] ?? null,
            percentChange: $data['percent_change'] ?? null,
            triggeredAt: $data['triggered_at']
        );
    }
}
