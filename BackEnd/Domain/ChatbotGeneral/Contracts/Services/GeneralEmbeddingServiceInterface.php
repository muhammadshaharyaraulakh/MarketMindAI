<?php

namespace Domain\ChatbotGeneral\Contracts\Services;

use App\Models\ChatMessage;

interface GeneralEmbeddingServiceInterface
{
    public function embedQuery(string $text): array;
    public function searchUserNamespace(array $queryVector, int $userId, int $topK = 8): array;
    public function embedAndUpsertChatTurn(ChatMessage $userMessage, ChatMessage $assistantMessage, int $userId): bool;
}
