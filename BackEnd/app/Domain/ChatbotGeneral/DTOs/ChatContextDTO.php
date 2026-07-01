<?php

namespace App\App\Domain\ChatbotGeneral\DTOs;

class ChatContextDTO
{
    public function __construct(
        public string $userMessage,
        public array $conversationHistory,
        public array $retrievedSummaries,
        public int $userId
    ) {}
}
