<?php

namespace App\Jobs;

use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\Contracts\Services\ReportAiServiceInterface;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GenerateReportSectionJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 2;
    public $timeout = 120; // 2 minutes max per section
    public $backoff = 30;

    protected int $reportId;
    protected string $sectionKey;
    protected string $campaignName;
    protected string $platform;
    protected array $allData;
    protected string $reportType;

    public function __construct(int $reportId, string $sectionKey, string $campaignName, string $platform, array $allData, string $reportType)
    {
        $this->reportId = $reportId;
        $this->sectionKey = $sectionKey;
        $this->campaignName = $campaignName;
        $this->platform = $platform;
        $this->allData = $allData;
        $this->reportType = $reportType;
    }

    public function handle(ReportAiServiceInterface $aiService, ReportRepositoryInterface $reportRepo)
    {
        if ($this->batch()->cancelled()) {
            return;
        }

        // Stagger API calls: sleep a few seconds based on section to avoid
        // all batch jobs hammering Gemini simultaneously
        $sectionDelays = [
            'ai_executive_summary' => 0,
            'ai_insight_narrative' => 4,
            'ai_insight_audience' => 8,
            'ai_insight_creative' => 12,
            'ai_insight_budget' => 16,
            'ai_personas' => 20,
            'ai_key_learnings' => 24,
            'ai_final_recommendations' => 28,
        ];
        $delay = $sectionDelays[$this->sectionKey] ?? 0;
        if ($delay > 0) {
            sleep($delay);
        }

        $text = '';
        
        try {
            // Map the section key to the appropriate AI Service method
            switch ($this->sectionKey) {
                case 'ai_executive_summary':
                    $text = $aiService->generateExecutiveSummary($this->allData['kpi_scorecard'], $this->allData['top_performers'], $this->campaignName, $this->platform);
                    break;
                case 'ai_insight_narrative':
                    $text = $aiService->generateInsightNarrative($this->allData, $this->campaignName);
                    break;
                case 'ai_insight_audience':
                    $text = $aiService->generateInsightBlock('audience_behavior', $this->allData['platform_breakdown'], $this->campaignName);
                    break;
                case 'ai_insight_creative':
                    $text = $aiService->generateInsightBlock('creative_performance', $this->allData['ad_creative_breakdown'], $this->campaignName);
                    break;
                case 'ai_insight_budget':
                    $text = $aiService->generateInsightBlock('budget_intelligence', $this->allData['ad_set_breakdown'], $this->campaignName);
                    break;
                case 'ai_personas':
                    $text = $aiService->generatePersonas($this->allData['ad_set_breakdown'], $this->allData['ad_set_breakdown']);
                    break;
                case 'ai_key_learnings':
                    $text = $aiService->generateKeyLearnings($this->allData, $this->reportType);
                    break;
                case 'ai_final_recommendations':
                    $text = $aiService->generateFinalRecommendations($this->allData);
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Failed to generate section {$this->sectionKey} for report {$this->reportId}: " . $e->getMessage());
            $text = "Analysis unavailable for this section. Please regenerate the report to retry AI content generation.";
        }

        // Always save the text (even fallback) so the section is never blank in the PDF
        Cache::put("report_{$this->reportId}_section_{$this->sectionKey}", $text, 3600);

        // Mark this section as complete in DB to update the frontend progress bar
        $report = $reportRepo->find($this->reportId);
        if ($report) {
            $sections = $report->completed_sections ?? [];
            if (!in_array($this->sectionKey, $sections)) {
                $sections[] = $this->sectionKey;
            }
            
            // Calculate progress
            $progress = 10 + (count($sections) * (80 / $report->total_sections)); 
            if ($progress > 90) $progress = 90;

            $reportRepo->update($this->reportId, [
                'completed_sections' => $sections,
                'progress_percent' => (int) $progress
            ]);
        }
    }
}
