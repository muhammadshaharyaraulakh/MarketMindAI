<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateRecommendationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public $tries = 2;

    public function __construct(
        public int $alertId
    ) {
        $this->onQueue('default');
    }

    public function handle(
        \App\Domain\Insights\Contracts\Services\RecommendationServiceInterface $recommendationService,
        \App\Domain\Insights\Contracts\Repositories\RecommendationRepositoryInterface $recommendationRepository,
        \App\Domain\Insights\Contracts\Services\InsightsPineconeServiceInterface $pineconeService
    ): void {
        $alert = \App\Models\Alert::find($this->alertId);
        if (!$alert) return;

        $dto = $recommendationService->generateForAlert($alert);
        $recommendation = $recommendationRepository->create($dto);

        $pineconeService->upsertAlert($alert, $recommendation, $alert->user_id);

        \Illuminate\Support\Facades\Log::info("GenerateRecommendationJob completed for Alert ID {$this->alertId}");
    }
}
