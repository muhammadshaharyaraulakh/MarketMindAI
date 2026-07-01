<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Reports\Requests\GenerateReportRequest;
use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\DTOs\ReportJobDTO;
use App\Jobs\GenerateReportJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    private ReportRepositoryInterface $reportRepo;

    public function __construct(ReportRepositoryInterface $reportRepo)
    {
        $this->reportRepo = $reportRepo;
    }

    public function campaigns(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $campaigns = DB::table('campaigns')
            ->where('user_id', $userId)
            ->select('id', 'name', 'platform', 'status', 'start_date', 'end_date')
            ->get();

        return response()->json($campaigns);
    }

    public function generate(GenerateReportRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $campaignId = $request->input('campaign_id');
        $reportType = $request->input('report_type');

        $campaign = DB::table('campaigns')->where('id', $campaignId)->first();
        if (!$campaign || $campaign->user_id !== $userId) {
            return response()->json(['error' => 'Campaign not found or unauthorized.'], 403);
        }

        $report = $this->reportRepo->create([
            'user_id' => $userId,
            'campaign_id' => $campaignId,
            'campaign_name' => $campaign->name,
            'report_type' => $reportType,
            'status' => 'pending',
            'total_sections' => $this->getTotalSections($reportType),
            'completed_sections' => [],
            'progress_percent' => 0,
        ]);

        $dto = new ReportJobDTO($report->id, $campaignId, $reportType, $userId);
        
        $jobId = app(\Illuminate\Contracts\Bus\Dispatcher::class)->dispatch(new GenerateReportJob($dto));
        
        $this->reportRepo->update($report->id, ['job_id' => $jobId]);

        return response()->json([
            'success' => true,
            'report_id' => $report->id,
            'job_id' => $jobId
        ]);
    }

    public function status(Request $request, int $reportId): JsonResponse
    {
        $report = $this->reportRepo->find($reportId);

        if (!$report || $report->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        return response()->json([
            'status' => $report->status,
            'completed_sections' => $report->completed_sections ?? [],
            'total_sections' => $report->total_sections,
            'progress_percent' => $report->progress_percent,
            'error' => $report->error_message,
        ]);
    }

    public function download(Request $request, int $reportId)
    {
        $report = $this->reportRepo->find($reportId);

        if (!$report || $report->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        if ($report->status !== 'completed' || empty($report->pdf_path)) {
            return response()->json(['error' => 'Report is not ready for download.'], 400);
        }

        if (!Storage::disk('reports_local')->exists($report->pdf_path)) {
            return response()->json(['error' => 'File not found on disk.'], 404);
        }

        return Storage::disk('reports_local')->download($report->pdf_path, "Report_{$report->report_type}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $reports = $this->reportRepo->findByUserId($request->user()->id);

        $mapped = $reports->map(function ($r) {
            return [
                'id' => $r->id,
                'report_type' => $r->report_type,
                'campaign_name' => $r->campaign_name,
                'status' => $r->status,
                'pdf_size_bytes' => $r->pdf_size_bytes,
                'generation_time_seconds' => $r->generation_time_seconds,
                'created_at' => $r->created_at,
            ];
        });

        return response()->json($mapped);
    }

    private function getTotalSections(string $reportType): int
    {
        return match ($reportType) {
            'performance_summary' => 2,
            'ai_insights' => 6,
            'campaign_breakdown' => 2,
            'full_analytics' => 8,
            default => 1,
        };
    }
}
