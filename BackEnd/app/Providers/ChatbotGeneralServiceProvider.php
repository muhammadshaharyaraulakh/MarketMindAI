<?php

namespace App\Providers;

use App\Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use App\Domain\ChatbotGeneral\Contracts\Repositories\ChatSessionRepositoryInterface;
use App\Domain\ChatbotGeneral\Contracts\Services\ChatbotServiceInterface;
use App\Domain\ChatbotGeneral\Contracts\Services\GeneralEmbeddingServiceInterface;
use App\Domain\ChatbotGeneral\Repositories\ChatMessageRepository;
use App\Domain\ChatbotGeneral\Repositories\ChatSessionRepository;
use App\Domain\ChatbotGeneral\Services\ChatbotService;
use App\Domain\ChatbotGeneral\Services\GeneralEmbeddingService;
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
