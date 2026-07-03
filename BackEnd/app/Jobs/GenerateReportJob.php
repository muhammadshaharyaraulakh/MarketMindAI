<?php

namespace App\Jobs;

use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\Contracts\Services\ReportDataServiceInterface;
use App\Domain\Reports\DTOs\ReportJobDTO;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 60; // Just fetching data and dispatching batch, so it's fast

    protected ReportJobDTO $dto;
    protected float $startTime;

    public function __construct(ReportJobDTO $dto)
    {
        $this->dto = $dto;
    }

    public function handle(
        ReportRepositoryInterface $reportRepo,
        ReportDataServiceInterface $dataService
    ) {
        $this->startTime = microtime(true);
        $reportId = $this->dto->reportId;
        
        try {
            // Step 1: Update status to processing
            $reportRepo->update($reportId, ['status' => 'processing']);

            // Step 2: Fetch all raw data
            $overview = $dataService->getCampaignOverview($this->dto->campaignId);
            $kpiScorecard = $dataService->getKpiScorecard($this->dto->campaignId);
            $dailyTrend = $dataService->getDailyTrend($this->dto->campaignId);
            $adSetBreakdown = $dataService->getAdSetBreakdown($this->dto->campaignId);
            $adCreativeBreakdown = $dataService->getAdCreativeBreakdown($this->dto->campaignId);
            $platformBreakdown = $dataService->getPlatformBreakdown($this->dto->campaignId);
            $topPerformers = $dataService->getTopPerformers($this->dto->campaignId);
            $dayOfWeekPerformance = $dataService->getDayOfWeekPerformance($this->dto->campaignId);
            $conversionFunnel = $dataService->getConversionFunnel($this->dto->campaignId);

            $this->markSectionComplete($reportRepo, $reportId, 'data_fetched', 10);

            $allData = [
                'overview' => $overview,
                'kpi_scorecard' => $kpiScorecard,
                'daily_trend' => $dailyTrend,
                'ad_set_breakdown' => $adSetBreakdown,
                'ad_creative_breakdown' => $adCreativeBreakdown,
                'platform_breakdown' => $platformBreakdown,
                'top_performers' => $topPerformers,
                'day_of_week' => $dayOfWeekPerformance,
                'conversion_funnel' => $conversionFunnel,
            ];

            // Store raw data in cache for the section jobs and the compile job
            Cache::put("report_{$reportId}_data", $allData, 3600);

            $campaignName = $overview['name'] ?? 'Unknown Campaign';
            $platform = $overview['platform'] ?? 'Unknown Platform';

            // Step 3: Build the jobs for the batch based on the report type
            $jobs = [];

            if ($this->dto->reportType === 'performance_summary' || $this->dto->reportType === 'full_analytics') {
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_executive_summary', $campaignName, $platform, $allData, $this->dto->reportType);
            }

            if ($this->dto->reportType === 'ai_insights' || $this->dto->reportType === 'full_analytics') {
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_insight_narrative', $campaignName, $platform, $allData, $this->dto->reportType);
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_insight_audience', $campaignName, $platform, $allData, $this->dto->reportType);
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_insight_creative', $campaignName, $platform, $allData, $this->dto->reportType);
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_insight_budget', $campaignName, $platform, $allData, $this->dto->reportType);
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_personas', $campaignName, $platform, $allData, $this->dto->reportType);
            }

            if ($this->dto->reportType === 'campaign_breakdown' || $this->dto->reportType === 'full_analytics') {
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_key_learnings', $campaignName, $platform, $allData, $this->dto->reportType);
            }

            if ($this->dto->reportType === 'full_analytics') {
                $jobs[] = new GenerateReportSectionJob($reportId, 'ai_final_recommendations', $campaignName, $platform, $allData, $this->dto->reportType);
            }

            // Step 4: Dispatch the Batch
            if (!empty($jobs)) {
                $reportType = $this->dto->reportType;
                $startTime = $this->startTime;
                
                Bus::batch($jobs)
                    ->name("Generate Report Sections: {$reportId}")
                    ->then(function ($batch) use ($reportId, $reportType, $startTime) {
                        // All section jobs completed successfully
                        dispatch(new \App\Jobs\CompileReportPdfJob($reportId, $reportType, $startTime));
                    })
                    ->catch(function ($batch, \Throwable $e) use ($reportId) {
                        // Handle batch failure
                        Log::error("Batch failed for report {$reportId}: " . $e->getMessage());
                        app(ReportRepositoryInterface::class)->update($reportId, [
                            'status' => 'failed',
                            'error_message' => 'One or more sections failed to generate.'
                        ]);
                    })
                    ->dispatch();
            } else {
                // If there are no AI sections (e.g. data only), compile PDF directly
                dispatch(new CompileReportPdfJob($reportId, $this->dto->reportType, $this->startTime));
            }

        } catch (\Exception $e) {
            Log::error('Report master job failed: ' . $e->getMessage());
            $reportRepo->update($reportId, [
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
        }
    }

    private function markSectionComplete(ReportRepositoryInterface $repo, int $reportId, string $section, int $progress)
    {
        $report = $repo->find($reportId);
        if ($report) {
            $sections = $report->completed_sections ?? [];
            if (!in_array($section, $sections)) {
                $sections[] = $section;
            }
            $repo->update($reportId, [
                'completed_sections' => $sections,
                'progress_percent' => $progress
            ]);
        }
    }

    public function failed(\Throwable $exception)
    {
        $repo = app(ReportRepositoryInterface::class);
        $repo->update($this->dto->reportId, [
            'status' => 'failed',
            'error_message' => $exception->getMessage()
        ]);
    }
}
