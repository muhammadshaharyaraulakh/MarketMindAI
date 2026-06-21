<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Domain\ChatbotGeneral\Contracts\Repositories\ChatMessageRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Repositories\ChatSessionRepositoryInterface;
use Domain\ChatbotGeneral\Contracts\Services\ChatbotServiceInterface;
use Domain\ChatbotGeneral\Requests\SendMessageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function __construct(
        private ChatbotServiceInterface $chatbotService,
        private ChatSessionRepositoryInterface $sessionRepo,
        private ChatMessageRepositoryInterface $messageRepo
    ) {}

    public function send(SendMessageRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $message = $request->input('message');
        $sessionId = $request->input('session_id');

        try {
            $responseDto = $this->chatbotService->sendMessage($sessionId, $message, $userId);

            return response()->json([
                'success' => true,
                'session_id' => $responseDto->sessionId,
                'message' => [
                    'role' => $responseDto->role,
                    'content' => $responseDto->content,
                    'created_at' => now()->toIso8601String()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], $e->getCode() === 404 ? 404 : 500);
        }
    }

    public function sessions(Request $request): JsonResponse
    {
        $userId = auth()->id();
        $sessions = $this->sessionRepo->listForUser($userId);

        return response()->json([
            'success' => true,
            'sessions' => $sessions
        ]);
    }

    public function history(Request $request, int $sessionId): JsonResponse
    {
        $userId = auth()->id();
        $session = $this->sessionRepo->findOwned($sessionId, $userId);

        if (!$session) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $messages = $this->messageRepo->getAllForSession($sessionId);

        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    public function deleteSession(Request $request, int $sessionId): JsonResponse
    {
        $userId = auth()->id();
        $session = $this->sessionRepo->findOwned($sessionId, $userId);

        if (!$session) {
            return response()->json(['error' => 'Not found'], 404);
        }

        // Manually delete messages then session
        \App\Models\ChatMessage::where('chat_session_id', $sessionId)->delete();
        $session->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
