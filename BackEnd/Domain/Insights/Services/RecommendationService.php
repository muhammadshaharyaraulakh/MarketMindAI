<?php

namespace Domain\Insights\Services;

use App\Models\Alert;
use Domain\Insights\Contracts\Services\RecommendationServiceInterface;
use Domain\Insights\DTOs\RecommendationDTO;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RecommendationService implements RecommendationServiceInterface
{
    public function generateForAlert(Alert $alert): RecommendationDTO
    {
        $prompt = "You are a marketing analytics expert. An automated system detected this issue:

Campaign: {$alert->campaign_name} on {$alert->platform}
Issue: {$alert->title}
Details: {$alert->detail}
Metric before: {$alert->metric_before}
Metric after: {$alert->metric_after}
Change: {$alert->percent_change}%

Write ONE specific, actionable recommendation in 2-3 sentences.
Reference the actual numbers above. Categorize your recommendation as exactly one of: budget, creative, audience, bidding, pacing. End your response with a new line containing only the category word in lowercase.

Plain text only, no markdown, no asterisks, no bullet points.";

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (!$apiKey) {
                throw new \Exception("GEMINI_API_KEY is not set");
            }

            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                ]
            ]);

            if ($response->successful()) {
                $text = $response->json('candidates.0.content.parts.0.text');
                if ($text) {
                    $text = preg_replace('/```[\s\S]*?```/', '', $text);
                    $lines = array_filter(array_map('trim', explode("\n", trim($text))));
                    
                    $category = 'bidding'; // default
                    $validCategories = ['budget', 'creative', 'audience', 'bidding', 'pacing'];
                    $lastLine = strtolower(end($lines));
                    
                    if (in_array($lastLine, $validCategories)) {
                        $category = $lastLine;
                        array_pop($lines);
                    }
                    
                    $recommendationText = implode(" ", $lines);
                    
                    return new RecommendationDTO(
                        alertId: $alert->id,
                        recommendationText: $recommendationText,
                        category: $category,
                        generatedViaAi: true
                    );
                }
            }
        } catch (\Exception $e) {
            Log::error("Gemini AI failed for recommendation: " . $e->getMessage());
        }

        // Fallback
        return $this->getFallbackRecommendation($alert);
    }

    private function getFallbackRecommendation(Alert $alert): RecommendationDTO
    {
        $text = "Review your campaign settings to address the recent performance changes.";
        $category = 'bidding';

        switch ($alert->alert_type) {
            case 'ctr_drop':
                $text = "Consider refreshing ad creative or reviewing audience targeting, as CTR decline often indicates creative fatigue or audience saturation.";
                $category = 'creative';
                break;
            case 'cpa_spike':
                $text = "Investigate the recent cost per acquisition spike. It is recommended to lower bids temporarily or narrow audience targeting to more highly converting segments.";
                $category = 'bidding';
                break;
            case 'conversion_drop':
                $text = "A significant drop in conversions has been detected. Check your landing pages for issues and review your audience match rate.";
                $category = 'audience';
                break;
            case 'spend_pacing':
                $text = "The campaign is spending too slowly. Consider increasing your bids to win more auctions and improve pacing.";
                $category = 'pacing';
                break;
            case 'budget_exhaustion':
                $text = "The daily budget is depleting too quickly. Consider lowering your bids or increasing the daily budget to keep ads running throughout the day.";
                $category = 'budget';
                break;
        }

        return new RecommendationDTO(
            alertId: $alert->id,
            recommendationText: $text,
            category: $category,
            generatedViaAi: false
        );
    }
}
