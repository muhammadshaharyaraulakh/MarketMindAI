<?php

namespace Domain\Reports\DTOs;

class ReportJobDTO
{
    public function __construct(
        public int $reportId,
        public int $campaignId,
        public string $reportType,
        public int $userId
    ) {}
}
