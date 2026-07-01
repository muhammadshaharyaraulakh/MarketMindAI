<?php

namespace App\Domain\ChatbotGeneral\Contracts\Services;

use App\Domain\ChatbotGeneral\DTOs\ChatMessageDTO;

interface ChatbotServiceInterface
{
    public function sendMessage(?int $sessionId, string $userMessage, int $userId): ChatMessageDTO;
}
