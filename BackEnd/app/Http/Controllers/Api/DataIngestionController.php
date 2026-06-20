<?php

namespace App\Http\Controllers\Api;

use App\Domain\DataIngestion\Contracts\Repositories\CampaignIngestionRepositoryInterface;
use App\Domain\DataIngestion\Contracts\Repositories\CsvUploadRepositoryInterface;
use App\Domain\DataIngestion\Contracts\Services\CsvParsingServiceInterface;
use App\Domain\DataIngestion\Contracts\Services\PineconeServiceInterface;
use App\Domain\DataIngestion\Requests\UploadCsvRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DataIngestionController extends Controller
{
    public function __construct(
        private CsvUploadRepositoryInterface $csvUploadRepo,
        private CampaignIngestionRepositoryInterface $campaignRepo,
        private CsvParsingServiceInterface $csvService,
        private PineconeServiceInterface $pineconeService
    ) {}

    public function upload(UploadCsvRequest $request): JsonResponse
    {
        $upload = null;
        try {
            $file = $request->file('file');
            
            $path = $file->storeAs(
                '', 
                time() . '_' . $file->getClientOriginalName(), 
                'data_ingestion'
            );

            $upload = $this->csvUploadRepo->createUploadRecord([
                'user_id' => $request->user()->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'platform' => $request->input('platform'),
            ]);

            $fullPath = config('filesystems.disks.data_ingestion.root') . '/' . $path;

            // Read headers to validate
            $handle = fopen($fullPath, 'r');
            if ($handle === false) {
                throw new \Exception('Cannot open file');
            }
            $headers = fgetcsv($handle, 0, ",", "\"", "\\");
            fclose($handle);

            $validation = $this->csvService->validateHeaders($headers);
            if (!$validation['valid']) {
                $this->csvUploadRepo->updateStatus($upload->id, 'failed', ['error_log' => 'Missing headers: ' . implode(', ', $validation['missing'])]);
                return response()->json([
                    'message' => 'Invalid CSV headers',
                    'missing_headers' => $validation['missing']
                ], 422);
            }

            $rows = $this->csvService->parseFile($fullPath);

            $result = $this->csvService->insertRows($rows, $request->user()->id, $upload->id);

            if (!empty($result['new_campaign_ids'])) {
                try {
                    $this->pineconeService->upsertAllCampaigns($result['new_campaign_ids'], $request->user()->id);
                } catch (\Exception $pineconeEx) {
                    \Illuminate\Support\Facades\Log::warning('Pinecone sync failed during ingestion: ' . $pineconeEx->getMessage());
                }
            }

            $this->csvUploadRepo->updateStatus($upload->id, 'ready', ['rows_processed' => $result['analytics_rows']]);

            return response()->json([
                'success' => true,
                'message' => 'Ingestion complete',
                'summary' => [
                    'campaigns' => $result['campaigns'],
                    'adsets' => $result['adsets'],
                    'ads' => $result['ads'],
                    'analytics_rows' => $result['analytics_rows'],
                ],
                'completed_campaigns' => $result['new_campaign_ids']
            ]);
        } catch (\Exception $e) {
            if ($upload) {
                $this->csvUploadRepo->updateStatus($upload->id, 'failed', ['error_log' => $e->getMessage()]);
            } else {
                \Illuminate\Support\Facades\Log::error('Upload failed before record creation: ' . $e->getMessage());
            }
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function completedCampaigns(Request $request): JsonResponse
    {
        $campaigns = $this->campaignRepo->getCompletedCampaigns($request->user()->id);
        return response()->json($campaigns);
    }

    public function campaignContext(Request $request, int $id): JsonResponse
    {
        $context = $this->campaignRepo->getCampaignWithStats($id, $request->user()->id);

        if (!$context) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json($context);
    }

    public function uploadHistory(Request $request): JsonResponse
    {
        $history = \App\Models\CsvUpload::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();
            
        return response()->json($history);
    }
}
