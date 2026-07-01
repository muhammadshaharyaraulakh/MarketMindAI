<?php

namespace App\Domain\ChatbotGeneral\Contracts\Repositories;

use App\Models\ChatMessage;
use App\Domain\ChatbotGeneral\DTOs\ChatMessageDTO;
use Illuminate\Database\Eloquent\Collection;

interface ChatMessageRepositoryInterface
{
    public function create(ChatMessageDTO $dto): ChatMessage;
    public function getRecentForSession(int $sessionId, int $limit = 10): Collection;
    public function getAllForSession(int $sessionId): Collection;
}
