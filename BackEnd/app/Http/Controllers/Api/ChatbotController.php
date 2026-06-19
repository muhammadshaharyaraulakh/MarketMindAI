<?php

namespace App\Http\Controllers\Api;

use App\Domain\DataIngestion\Contracts\Services\PineconeServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function __construct(
        private PineconeServiceInterface $pineconeService
    ) {}

    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'array',
        ]);

        $message = $request->input('message');
        $history = $request->input('history', []);
        
        $apiKey = $request->header('X-Gemini-Key') ?: env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'API Key missing'], 400);
        }

        // 1. Get Pinecone Context
        $contexts = $this->pineconeService->query($message, $request->user()->id, 5);
        
        $contextString = empty($contexts) ? "No uploaded campaign data found." : implode("\n\n", $contexts);

        // 2. Build Prompt
        $systemPrompt = "You are MarketMind AI Advisor, an expert digital marketing analyst. Answer questions using ONLY the following uploaded campaign data context.\n\nCONTEXT:\n" . $contextString;

        $contents = [];
        foreach ($history as $msg) {
            // Gemini strictly expects 'user' or 'model' roles
            $role = $msg['role'] === 'user' ? 'user' : 'model';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $msg['parts'][0]['text']]]
            ];
        }
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $message]]
        ];

        // 3. Call Gemini
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        try {
            $response = Http::post($url, [
                'system_instruction' => ['parts' => [['text' => $systemPrompt]]],
                'contents' => $contents
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't generate a response.";
                return response()->json(['reply' => $reply]);
            } else {
                Log::error('Chatbot Gemini Error', ['response' => $response->body()]);
                return response()->json(['error' => 'Failed to reach AI provider: ' . $response->json('error.message', 'Unknown error')], 502);
            }
        } catch (\Exception $e) {
            Log::error('Chatbot Exception', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error: ' . $e->getMessage()], 500);
        }
    }
}
