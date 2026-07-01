<?php

namespace App\App\Domain\ChatbotGeneral\DTOs;

class ChatMessageDTO
{
    public function __construct(
        public ?int $sessionId,
        public string $role,
        public string $content,
        public ?array $retrievedContext = null
    ) {}
}
