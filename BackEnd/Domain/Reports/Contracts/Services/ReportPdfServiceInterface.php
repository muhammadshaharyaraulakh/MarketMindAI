<?php

namespace Domain\Reports\Contracts\Services;

interface ReportPdfServiceInterface
{
    public function generatePdf(array $reportData, string $reportType, int $reportId): array;
}
