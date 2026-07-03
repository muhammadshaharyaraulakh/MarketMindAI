<?php

namespace App\Jobs;

use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\Contracts\Services\ReportPdfServiceInterface;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CompileReportPdfJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 180;

    protected int $reportId;
    protected string $reportType;
    protected float $startTime;

    public function __construct(int $reportId, string $reportType, float $startTime)
    {
        $this->reportId = $reportId;
        $this->reportType = $reportType;
        $this->startTime = $startTime;
    }

    public function handle(ReportRepositoryInterface $reportRepo, ReportPdfServiceInterface $pdfService)
    {
        try {
            // Retrieve data from cache
            $allData = Cache::get("report_{$this->reportId}_data", []);
            
            // Retrieve AI sections from cache
            $aiData = [];
            $sectionKeys = [
                'ai_executive_summary' => 'executive_summary',
                'ai_insight_narrative' => 'insight_narrative',
                'ai_insight_audience' => 'insight_audience',
                'ai_insight_creative' => 'insight_creative',
                'ai_insight_budget' => 'insight_budget',
                'ai_personas' => 'personas',
                'ai_key_learnings' => 'key_learnings',
                'ai_final_recommendations' => 'final_recommendations'
            ];

            foreach ($sectionKeys as $cacheKey => $templateKey) {
                // Fetch each section from cache (fallback to empty string if not generated for this report type)
                $aiData[$templateKey] = Cache::get("report_{$this->reportId}_section_{$cacheKey}");
            }

            // Assemble report data
            $reportData = [
                'data' => $allData,
                'ai' => array_filter($aiData), // Remove nulls
            ];

            // Generate PDF
            $pdfResult = $pdfService->generatePdf($reportData, $this->reportType, $this->reportId);
            
            // Complete
            $elapsed = (int) (microtime(true) - $this->startTime);
            
            $reportRepo->update($this->reportId, [
                'status' => 'completed',
                'progress_percent' => 100,
                'pdf_path' => $pdfResult['path'],
                'pdf_size_bytes' => $pdfResult['size'],
                'generation_time_seconds' => $elapsed,
            ]);

            // Clean up cache
            Cache::forget("report_{$this->reportId}_data");
            foreach ($sectionKeys as $cacheKey => $templateKey) {
                Cache::forget("report_{$this->reportId}_section_{$cacheKey}");
            }

        } catch (\Exception $e) {
            Log::error("Failed to compile PDF for report {$this->reportId}: " . $e->getMessage());
            $reportRepo->update($this->reportId, [
                'status' => 'failed',
                'error_message' => 'Failed to generate PDF document.'
            ]);
        }
    }
}
