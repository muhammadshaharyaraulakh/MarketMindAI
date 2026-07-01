<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DetectAnomaliesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public $tries = 2;

    public function __construct(
        public ?int $userId = null
    ) {
        $this->onQueue('default');
    }

    public function handle(
        \App\Domain\Insights\Contracts\Services\AnomalyDetectionServiceInterface $detectionService,
        \App\Domain\Insights\Contracts\Repositories\AlertRepositoryInterface $alertRepository
    ): void {
        $usersToProcess = $this->userId ? collect([$this->userId]) : \App\Models\User::whereHas('campaigns', function ($query) {
            $query->where('status', 'active');
        })->pluck('id');

        $newAlertsCount = 0;

        foreach ($usersToProcess as $uId) {
            $anomalies = $detectionService->detectForUser($uId);

            foreach ($anomalies as $dto) {
                $duplicate = $alertRepository->findRecentDuplicate($uId, $dto->campaignId, $dto->alertType);

                if ($duplicate) {
                    $alertRepository->updateMetrics($duplicate, $dto);
                } else {
                    $alert = $alertRepository->create($dto);
                    $newAlertsCount++;
                    dispatch(new GenerateRecommendationJob($alert->id));
                }
            }
        }

        \Illuminate\Support\Facades\Log::info("DetectAnomaliesJob completed. {$newAlertsCount} new alerts across {$usersToProcess->count()} users.");
    }
}
