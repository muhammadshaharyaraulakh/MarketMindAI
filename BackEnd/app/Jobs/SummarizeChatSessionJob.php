<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface;

class SummarizeChatSessionJob implements ShouldQueue
{
    use Queueable;

    public $tries = 2;

    public function __construct(
        public int $sessionId,
        public int $userId
    ) {
        $this->onQueue('default');
    }

    public function handle(
        ChatMessageRepositoryInterface $messageRepo,
        GeneralEmbeddingServiceInterface $embeddingService
    ): void {
        try {
            // Fetch the whole session history
            $messages = $messageRepo->getRecentForSession($this->sessionId, 100);
            
            if ($messages->isEmpty()) {
                return;
            }

            $conversationText = "";
            foreach ($messages as $msg) {
                $role = ucfirst($msg->role);
                $conversationText .= "{$role}: {$msg->content}\n";
            }

            $apiKey = config('services.chatbot.key');
            if (!$apiKey) {
                return;
            }

            $systemPrompt = "You are an expert user behavior analyst. Read the following conversation between a User and a Marketing AI Assistant. Extract the user's key preferences, marketing goals, and business constraints into a single concise paragraph. Focus ONLY on actionable preferences (e.g., 'User prefers meta ads, strict CPA under $10'). If no strong preferences are found, output 'NO_PREFERENCES_FOUND'.";

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";
            
            $response = Http::post($url, [
                'system_instruction' => [
                    'parts' => [['text' => $systemPrompt]]
                ],
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => "Conversation:\n" . $conversationText]]]
                ]
            ]);

            if ($response->successful()) {
                $json = $response->json();
                if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                    $summary = trim($json['candidates'][0]['content']['parts'][0]['text']);
                    
                    if (str_contains($summary, 'NO_PREFERENCES_FOUND') || strlen($summary) < 10) {
                        return; // Nothing useful to save
                    }

                    // Embed the summary
                    $vector = $embeddingService->embedQuery($summary);
                    if (empty($vector)) {
                        return;
                    }

                    // Upsert to Pinecone
                    $pineconeHost = env('PINECONE_INDEX_HOST');
                    $pineconeKey = env('PINECONE_API_KEY');

                    if ($pineconeHost && $pineconeKey) {
                        $upsertUrl = rtrim($pineconeHost, '/') . '/vectors/upsert';
                        Http::withHeaders([
                            'Api-Key' => $pineconeKey,
                            'Content-Type' => 'application/json'
                        ])->post($upsertUrl, [
                            'vectors' => [[
                                'id' => "session_summary_{$this->sessionId}_{$this->userId}",
                                'values' => $vector,
                                'metadata' => [
                                    'type' => 'user_preference',
                                    'user_id' => $this->userId,
                                    'summary' => $summary,
                                    'session_id' => $this->sessionId
                                ]
                            ]],
                            'namespace' => "user_{$this->userId}"
                        ]);
                        
                        Log::info("SummarizeChatSessionJob completed successfully for user {$this->userId}.");
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("SummarizeChatSessionJob exception: " . $e->getMessage());
        }
    }
}
