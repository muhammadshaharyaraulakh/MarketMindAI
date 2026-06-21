<?php

namespace Domain\ChatbotGeneral\Contracts\Services;

use Domain\ChatbotGeneral\DTOs\ChatMessageDTO;

interface ChatbotServiceInterface
{
    public function sendMessage(?int $sessionId, string $userMessage, int $userId): ChatMessageDTO;
}
