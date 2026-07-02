<?php

namespace App\Jobs;

use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\Contracts\Services\ReportDataServiceInterface;
use App\Domain\Reports\Contracts\Services\ReportAiServiceInterface;
use App\Domain\Reports\Contracts\Services\ReportPdfServiceInterface;
use App\Domain\Reports\DTOs\ReportJobDTO;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateReportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 300;
    public $backoff = 60;

    protected ReportJobDTO $dto;
    protected float $startTime;

    public function __construct(ReportJobDTO $dto)
    {
        $this->dto = $dto;
    }

    public function handle(
        ReportRepositoryInterface $reportRepo,
        ReportDataServiceInterface $dataService,
        ReportAiServiceInterface $aiService,
        ReportPdfServiceInterface $pdfService
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

            // Step 3: Generate AI text sections based on report type
            $campaignName = $overview['name'] ?? 'Unknown Campaign';
            $platform = $overview['platform'] ?? 'Unknown Platform';
            
            $aiData = [];

            if ($this->dto->reportType === 'performance_summary' || $this->dto->reportType === 'full_analytics') {
                $aiData['executive_summary'] = $aiService->generateExecutiveSummary($kpiScorecard, $topPerformers, $campaignName, $platform);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_executive_summary', 30);
                sleep(10); // Delay to prevent spam
            }

            if ($this->dto->reportType === 'ai_insights' || $this->dto->reportType === 'full_analytics') {
                $aiData['insight_narrative'] = $aiService->generateInsightNarrative($allData, $campaignName);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_insight_narrative', 40);
                sleep(10);

                $aiData['insight_audience'] = $aiService->generateInsightBlock('audience_behavior', $platformBreakdown, $campaignName);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_insight_audience', 50);
                sleep(10);

                $aiData['insight_creative'] = $aiService->generateInsightBlock('creative_performance', $adCreativeBreakdown, $campaignName);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_insight_creative', 60);
                sleep(10);

                $aiData['insight_budget'] = $aiService->generateInsightBlock('budget_intelligence', $adSetBreakdown, $campaignName);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_insight_budget', 70);
                sleep(10);

                $aiData['personas'] = $aiService->generatePersonas($adSetBreakdown, $adSetBreakdown);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_personas', 80);
                sleep(10);
            }

            if ($this->dto->reportType === 'campaign_breakdown' || $this->dto->reportType === 'full_analytics') {
                $aiData['key_learnings'] = $aiService->generateKeyLearnings($allData, $this->dto->reportType);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_key_learnings', 90);
                sleep(10);
            }

            if ($this->dto->reportType === 'full_analytics') {
                $aiData['final_recommendations'] = $aiService->generateFinalRecommendations($allData);
                $this->markSectionComplete($reportRepo, $reportId, 'ai_final_recommendations', 95);
                sleep(10);
            }

            // Step 4: Assemble report data
            $reportData = [
                'data' => $allData,
                'ai' => $aiData,
            ];

            // Step 5: Generate PDF
            $pdfResult = $pdfService->generatePdf($reportData, $this->dto->reportType, $reportId);
            
            // Step 6: Complete
            $elapsed = (int) (microtime(true) - $this->startTime);
            
            $reportRepo->update($reportId, [
                'status' => 'completed',
                'progress_percent' => 100,
                'pdf_path' => $pdfResult['path'],
                'pdf_size_bytes' => $pdfResult['size'],
                'generation_time_seconds' => $elapsed,
            ]);

        } catch (\Exception $e) {
            Log::error('Report generation failed: ' . $e->getMessage());
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
