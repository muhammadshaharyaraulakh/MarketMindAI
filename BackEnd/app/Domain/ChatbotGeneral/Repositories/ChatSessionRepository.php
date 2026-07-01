<?php

namespace App\App\Domain\ChatbotGeneral\Repositories;

use App\Models\ChatSession;
use App\App\Domain\ChatbotGeneral\Contracts\Repositories\ChatSessionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ChatSessionRepository implements ChatSessionRepositoryInterface
{
    public function create(int $userId, string $mode = 'general'): ChatSession
    {
        return ChatSession::create([
            'user_id' => $userId,
            'mode' => $mode,
            'last_message_at' => now(),
        ]);
    }

    public function findOwned(int $id, int $userId): ?ChatSession
    {
        return ChatSession::where('id', $id)->where('user_id', $userId)->first();
    }

    public function listForUser(int $userId): Collection
    {
        return ChatSession::where('user_id', $userId)
            ->orderByDesc('last_message_at')
            ->get();
    }

    public function updateTitle(int $id, string $title): void
    {
        ChatSession::where('id', $id)->update(['title' => $title]);
    }

    public function touchLastMessage(int $id): void
    {
        ChatSession::where('id', $id)->update(['last_message_at' => now()]);
    }
}
