<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class EmbedChatTurnJob implements ShouldQueue
{
    use Queueable;

    public $tries = 2;

    public function __construct(
        public int $userMessageId,
        public int $assistantMessageId,
        public int $userId
    ) {
        $this->onQueue('default');
    }

    public function handle(\Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface $embeddingService): void
    {
        try {
            $userMessage = \App\Models\ChatMessage::find($this->userMessageId);
            $assistantMessage = \App\Models\ChatMessage::find($this->assistantMessageId);

            if (!$userMessage || !$assistantMessage) {
                return;
            }

            $success = $embeddingService->embedAndUpsertChatTurn($userMessage, $assistantMessage, $this->userId);

            if ($success) {
                Log::info("EmbedChatTurnJob completed successfully for user {$this->userId}.");
            } else {
                Log::warning("EmbedChatTurnJob failed to upsert for user {$this->userId}.");
            }
        } catch (\Exception $e) {
            Log::error("EmbedChatTurnJob exception: " . $e->getMessage());
        }
    }
}
