<?php

namespace App\Domain\ChatbotGeneral\Repositories;

use App\Models\ChatMessage;
use App\Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use App\Domain\ChatbotGeneral\DTOs\ChatMessageDTO;
use Illuminate\Database\Eloquent\Collection;

class ChatMessageRepository implements ChatMessageRepositoryInterface
{
    public function create(ChatMessageDTO $dto): ChatMessage
    {
        return ChatMessage::create([
            'chat_session_id' => $dto->sessionId,
            'role' => $dto->role,
            'content' => $dto->content,
            'retrieved_context' => $dto->retrievedContext,
        ]);
    }

    public function getRecentForSession(int $sessionId, int $limit = 10): Collection
    {
        // Get recent desc, then reverse to chronological
        return ChatMessage::where('chat_session_id', $sessionId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->reverse()
            ->values();
    }

    public function getAllForSession(int $sessionId): Collection
    {
        return ChatMessage::where('chat_session_id', $sessionId)
            ->orderBy('created_at')
            ->get();
    }
}
