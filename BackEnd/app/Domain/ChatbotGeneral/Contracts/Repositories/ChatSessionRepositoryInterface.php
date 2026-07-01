<?php

namespace App\App\Domain\ChatbotGeneral\Contracts\Repositories;

use App\Models\ChatSession;
use Illuminate\Database\Eloquent\Collection;

interface ChatSessionRepositoryInterface
{
    public function create(int $userId, string $mode = 'general'): ChatSession;
    public function findOwned(int $id, int $userId): ?ChatSession;
    public function listForUser(int $userId): Collection;
    public function updateTitle(int $id, string $title): void;
    public function touchLastMessage(int $id): void;
}
