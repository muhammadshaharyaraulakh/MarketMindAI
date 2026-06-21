<?php

namespace App\Providers;

use Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Repositories\ChatSessionRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Services\ChatbotServiceInterface;
use Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface;
use Domain\ChatbotGeneral\Repositories\ChatMessageRepository;
use Domain\ChatbotGeneral\Repositories\ChatSessionRepository;
use Domain\ChatbotGeneral\Services\ChatbotService;
use Domain\ChatbotGeneral\Services\GeneralEmbeddingService;
use Illuminate\Support\ServiceProvider;

class ChatbotGeneralServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ChatSessionRepositoryInterface::class, ChatSessionRepository::class);
        $this->app->bind(ChatMessageRepositoryInterface::class, ChatMessageRepository::class);
        $this->app->bind(GeneralEmbeddingServiceInterface::class, GeneralEmbeddingService::class);
        $this->app->bind(ChatbotServiceInterface::class, ChatbotService::class);
    }
}
