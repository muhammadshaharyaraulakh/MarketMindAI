<?php

namespace Domain\ChatbotGeneral\Services;

use Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Repositories\ChatSessionRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Services\ChatbotServiceInterface;
use Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface;
use Domain\ChatbotGeneral\DTOs\ChatMessageDTO;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotService implements ChatbotServiceInterface
{
    public function __construct(
        private ChatSessionRepositoryInterface $sessionRepo,
        private ChatMessageRepositoryInterface $messageRepo,
        private GeneralEmbeddingServiceInterface $embeddingService
    ) {}

    public function sendMessage(?int $sessionId, string $userMessage, int $userId): ChatMessageDTO
    {
        // 1. Verify/Create session
        if ($sessionId) {
            $session = $this->sessionRepo->findOwned($sessionId, $userId);
            if (!$session) {
                throw new \Exception("Session not found or unauthorized.");
            }
        } else {
            $session = $this->sessionRepo->create($userId);
            $sessionId = $session->id;
        }

        // 2. Fetch last 10 messages
        $history = $this->messageRepo->getRecentForSession($sessionId, 10);

        // 3. Embed query
        $queryVector = $this->embeddingService->embedQuery($userMessage);

        // 4. Search Pinecone
        $retrievedMatches = $this->embeddingService->searchUserNamespace($queryVector, $userId, 8);

        // 5. Build system prompt
        $retrievedContextStr = "";
        foreach ($retrievedMatches as $match) {
            $retrievedContextStr .= "- {$match['text']} (relevance: {$match['score']})\n";
        }

        $historyStr = "";
        foreach ($history as $msg) {
            $role = ucfirst($msg->role);
            $historyStr .= "{$role}: {$msg->content}\n";
        }

        $systemPrompt = "You are MarketMind AI Advisor, an expert digital marketing analyst assistant. You have access to retrieved context about this user's campaigns, performance history, and past alerts.

RETRIEVED CONTEXT:
{$retrievedContextStr}

CONVERSATION HISTORY:
{$historyStr}

Answer the user's question using the retrieved context above when relevant. If the retrieved context does not contain information relevant to the question, say so honestly rather than inventing campaign details. Be concise, specific, and reference actual numbers and campaign names from the context when available. Write in plain conversational text, no markdown formatting, no asterisks, no bullet points.";

        // 6. Call Gemini
        $apiKey = config('services.chatbot.key');
        $assistantContent = "I'm having trouble processing that right now. Please try again in a moment.";
        $isFallback = true;

        if ($apiKey) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";
            
            try {
                $response = Http::post($url, [
                    'system_instruction' => [
                        'parts' => [['text' => $systemPrompt]]
                    ],
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $userMessage]]]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                    ]
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                        $rawResponse = $json['candidates'][0]['content']['parts'][0]['text'];
                        
                        // 7. Cleanup markdown
                        $cleanResponse = preg_replace('/(\*\*|__)(.*?)\1/', '$2', $rawResponse);
                        $cleanResponse = preg_replace('/(\*|_)(.*?)\1/', '$2', $cleanResponse);
                        $cleanResponse = preg_replace('/^[\*\-]\s+/m', '', $cleanResponse);
                        $assistantContent = trim($cleanResponse);
                        $isFallback = false;
                    }
                } else {
                    Log::error('Gemini Chatbot API Error', ['body' => $response->body()]);
                }
            } catch (\Exception $e) {
                Log::error('Gemini Chatbot Exception', ['message' => $e->getMessage()]);
            }
        } else {
            Log::error('CHATBOT_API_KEY missing.');
        }

        // 8. Store user and assistant messages
        $userMsgDto = new ChatMessageDTO($sessionId, 'user', $userMessage);
        $userMessageModel = $this->messageRepo->create($userMsgDto);

        $retrievedContextForDb = array_map(function($match) {
            return [
                'id' => $match['id'],
                'score' => $match['score'],
                'snippet' => substr($match['text'], 0, 100) . '...'
            ];
        }, $retrievedMatches);

        $assistantMsgDto = new ChatMessageDTO($sessionId, 'assistant', $assistantContent, $retrievedContextForDb);
        $assistantMessageModel = $this->messageRepo->create($assistantMsgDto);

        // 9. Update session
        $this->sessionRepo->touchLastMessage($sessionId);

        // 10. Generate Title if needed
        if ($history->isEmpty()) {
            $this->generateTitle($sessionId, $userMessage, $apiKey);
        }

        // 11. Dispatch embedding job
        if (!$isFallback) {
            dispatch(new \App\Jobs\EmbedChatTurnJob($userMessageModel->id, $assistantMessageModel->id, $userId));
        }

        return $assistantMsgDto;
    }

    private function generateTitle(int $sessionId, string $userMessage, ?string $apiKey): void
    {
        $title = substr($userMessage, 0, 40) . '...';

        if ($apiKey) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={$apiKey}";
            try {
                $response = Http::post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => "Write a 3-5 word title summarizing this message: {$userMessage}. Only output the title, no quotes."]]]
                    ]
                ]);
                if ($response->successful()) {
                    $json = $response->json();
                    if (isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                        $generated = trim($json['candidates'][0]['content']['parts'][0]['text']);
                        $generated = trim($generated, '"\'');
                        if (!empty($generated)) {
                            $title = substr($generated, 0, 255);
                        }
                    }
                }
            } catch (\Exception $e) {
                // fallback to truncated message
            }
        }

        $this->sessionRepo->updateTitle($sessionId, $title);
    }
}
