<?php

namespace App\App\Domain\ChatbotGeneral\Services;

use App\Models\ChatMessage;
use App\App\Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeneralEmbeddingService implements GeneralEmbeddingServiceInterface
{
    public function embedQuery(string $text): array
    {
        $apiKey = config('services.chatbot.key');
        if (!$apiKey) {
            Log::error('CHATBOT_API_KEY not set.');
            return [];
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={$apiKey}";

        try {
            $response = Http::post($url, [
                'model' => 'models/gemini-embedding-001',
                'content' => [
                    'parts' => [
                        ['text' => $text]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['embedding']['values'] ?? [];
            } else {
                Log::error('Chatbot Gemini embedding failed', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Chatbot Gemini embedding exception', ['message' => $e->getMessage()]);
        }

        return [];
    }

    public function searchUserNamespace(array $queryVector, int $userId, int $topK = 8): array
    {
        if (empty($queryVector)) {
            return [];
        }

        $pineconeHost = env('PINECONE_INDEX_HOST');
        $pineconeKey = env('PINECONE_API_KEY');

        if (!$pineconeHost || !$pineconeKey) {
            Log::error('Pinecone configuration missing for ChatbotGeneral.');
            return [];
        }

        $url = rtrim($pineconeHost, '/') . '/query';

        try {
            $response = Http::withHeaders([
                'Api-Key' => $pineconeKey,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'vector' => $queryVector,
                'topK' => $topK,
                'includeMetadata' => true,
                'namespace' => "user_{$userId}"
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $contexts = [];
                if (isset($data['matches'])) {
                    foreach ($data['matches'] as $match) {
                        if (isset($match['metadata']['summary'])) {
                            $contexts[] = [
                                'id' => $match['id'],
                                'score' => $match['score'] ?? 0,
                                'text' => $match['metadata']['summary']
                            ];
                        } elseif (isset($match['metadata']['text'])) {
                            $contexts[] = [
                                'id' => $match['id'],
                                'score' => $match['score'] ?? 0,
                                'text' => $match['metadata']['text']
                            ];
                        }
                    }
                }
                return $contexts;
            } else {
                Log::error('Pinecone searchUserNamespace failed', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Pinecone searchUserNamespace exception', ['message' => $e->getMessage()]);
        }

        return [];
    }

    public function embedAndUpsertChatTurn(ChatMessage $userMessage, ChatMessage $assistantMessage, int $userId): bool
    {
        $assistantText = substr($assistantMessage->content, 0, 200);
        $summaryText = "User asked: {$userMessage->content}. Assistant responded: {$assistantText}";

        $vector = $this->embedQuery($summaryText);
        if (empty($vector)) {
            return false;
        }

        $pineconeHost = env('PINECONE_INDEX_HOST');
        $pineconeKey = env('PINECONE_API_KEY');

        if (!$pineconeHost || !$pineconeKey) {
            return false;
        }

        $url = rtrim($pineconeHost, '/') . '/vectors/upsert';

        try {
            $response = Http::withHeaders([
                'Api-Key' => $pineconeKey,
                'Content-Type' => 'application/json'
            ])->post($url, [
                'vectors' => [[
                    'id' => "chat_{$userMessage->id}_{$userId}",
                    'values' => $vector,
                    'metadata' => [
                        'type' => 'conversation',
                        'user_id' => $userId,
                        'summary' => $summaryText
                    ]
                ]],
                'namespace' => "user_{$userId}"
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Pinecone upsert chat turn exception', ['message' => $e->getMessage()]);
            return false;
        }
    }
}
