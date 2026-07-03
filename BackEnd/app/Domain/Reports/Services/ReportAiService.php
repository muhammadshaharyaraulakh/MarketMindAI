<?php

namespace App\Domain\Reports\Services;

use App\Domain\Reports\Contracts\Services\ReportAiServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReportAiService implements ReportAiServiceInterface
{
    private string $systemPrompt = "You are a professional marketing analyst writing a formal business report. Write in clear, professional prose only. Do not use markdown formatting of any kind. Do not use asterisks, stars, bullet points, numbered lists, or pound signs for headings. Do not bold any text. Write in complete sentences and paragraphs only. The text you write will be inserted directly into a pre-formatted PDF document that already has its own headings and visual structure. IMPORTANT: If any data or information is missing or empty for a specific section, do not simply state that data is missing. Instead, briefly acknowledge the lack of data and then use your expertise to provide a long, detailed paragraph of strategic suggestions and best practices relevant to that specific section's topic.";
    
    private string $reminder = "Remember: plain prose only. No asterisks, no bullet points, no numbered lists, no pound signs, no bold markers. If data is missing, provide a detailed hypothetical best-practice suggestion paragraph instead.";

    private function callGemini(string $prompt, int $maxTokens = 600): string
    {
        $keys = config('services.gemini_report.keys', []);
        $apiKey = !empty($keys) && $keys[0] !== null ? $keys[array_rand($keys)] : env('GEMINI_API_KEY');
        
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
        $maxRetries = 3;
        $attempt = 0;

        while ($attempt < $maxRetries) {
            try {
                $response = Http::post($url, [
                    'system_instruction' => [
                        'parts' => [['text' => $this->systemPrompt]]
                    ],
                    'contents' => [
                        ['parts' => [['text' => $prompt . "\n\n" . $this->reminder]]]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.4,
                        'maxOutputTokens' => $maxTokens,
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    return trim(preg_replace('/[*#`]+/', '', $text));
                }

                $status = $response->status();
                if ($status === 503 || $status === 429) {
                    $attempt++;
                    if ($attempt < $maxRetries) {
                        // Sleep much longer for rate limits (15 RPM free tier)
                        // 15 seconds, then 30 seconds
                        sleep(15 * $attempt); 
                        continue;
                    }
                }

                Log::error("Gemini API Error in ReportAiService (Attempt {$attempt}): " . $response->body());
                return "Analysis unavailable for this section. Please regenerate the report to retry AI content generation.";
                
            } catch (\Exception $e) {
                $attempt++;
                if ($attempt < $maxRetries) {
                    sleep(pow(2, $attempt));
                    continue;
                }
                Log::error('Exception in ReportAiService: ' . $e->getMessage());
                return "Analysis unavailable for this section. Please regenerate the report to retry AI content generation.";
            }
        }
        return "Analysis unavailable for this section. Please regenerate the report to retry AI content generation.";
    }

    public function generateExecutiveSummary(array $kpiData, array $topPerformers, string $campaignName, string $platform): string
    {
        $prompt = "Generate a massive, highly elaborate 6-8 paragraph executive summary of performance for the {$platform} campaign '{$campaignName}'. Provide extreme in-depth analysis of every single number. Write at least 600 words.\n\nKPIs:\n" . json_encode($kpiData) . "\n\nTop Performers:\n" . json_encode($topPerformers);
        return $this->callGemini($prompt, 3000);
    }

    public function generateInsightNarrative(array $allData, string $campaignName): string
    {
        $prompt = "Generate a massive, highly detailed executive narrative for the AI Insights report for the campaign '{$campaignName}'. Provide a highly detailed big picture summary, followed by elaborate, deep-dive paragraphs detailing 4-5 key unexpected findings. Write in rich, descriptive prose, minimum 600 words.\n\nData Context:\n" . json_encode($allData);
        return $this->callGemini($prompt, 3000);
    }

    public function generateInsightBlock(string $topic, array $relevantData, string $campaignName): string
    {
        $prompt = "Generate a massive, highly detailed deep-dive insight block for the topic '{$topic}' for the campaign '{$campaignName}'. Write exactly 5 extensive, in-depth paragraphs covering: What happened, Why it happened, Historical context, Future implications, and Recommendation. Minimum 600 words.\n\nRelevant Data:\n" . json_encode($relevantData);
        return $this->callGemini($prompt, 3000);
    }

    public function generatePersonas(array $adSetTargeting, array $adSetPerformance): string
    {
        $prompt = "Generate 3 highly elaborate, comprehensive consumer persona descriptions based on the targeting and performance data. Give them names and write deep, detailed 3-paragraph psychological profiles for each persona describing their demographics, behaviors, fears, desires, and exactly why they convert. Minimum 700 words.\n\nTargeting Data:\n" . json_encode($adSetTargeting) . "\n\nPerformance Data:\n" . json_encode($adSetPerformance);
        return $this->callGemini($prompt, 3000);
    }

    public function generateKeyLearnings(array $allData, string $reportType): string
    {
        $prompt = "Generate a massive, elaborate deep-dive into key learnings for the '{$reportType}'. Provide exactly 5 extensive paragraphs: detailed analysis of what succeeded, why it succeeded, what underperformed, why it failed, and elaborate action items. Minimum 600 words.\n\nData Context:\n" . json_encode($allData);
        return $this->callGemini($prompt, 3000);
    }

    public function generateFinalRecommendations(array $allData): string
    {
        $prompt = "Generate a massive, highly detailed, and comprehensive strategic recommendation essay. Cover budget allocation, creative strategy, audience targeting, and timing recommendations in extreme depth for the next campaign period based on the data. Write a minimum of 8 extensive paragraphs and at least 800 words.\n\nData Context:\n" . json_encode($allData);
        return $this->callGemini($prompt, 4000);
    }
}
