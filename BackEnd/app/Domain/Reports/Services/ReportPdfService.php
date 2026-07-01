<?php

namespace App\App\Domain\Reports\Services;

use App\App\Domain\Reports\Contracts\Services\ReportPdfServiceInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReportPdfService implements ReportPdfServiceInterface
{
    public function generatePdf(array $reportData, string $reportType, int $reportId): array
    {
        $pdf = Pdf::loadView('reports.template', [
            'reportData' => $reportData,
            'reportType' => $reportType,
            'reportId' => $reportId,
        ]);

        $filename = "report_{$reportId}_" . time() . ".pdf";
        $path = "reports/{$filename}";

        // Save to the local disk using Storage facade
        // The requirements say storage/app/local/reports/ so we should use the reports_local disk
        Storage::disk('reports_local')->put($filename, $pdf->output());

        $absolutePath = Storage::disk('reports_local')->path($filename);
        $size = filesize($absolutePath);

        return [
            'path' => $filename,
            'size' => $size,
        ];
    }
}
