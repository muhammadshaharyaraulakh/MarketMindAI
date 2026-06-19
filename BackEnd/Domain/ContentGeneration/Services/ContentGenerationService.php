<?php
namespace Domain\ContentGeneration\Services;

use Domain\ContentGeneration\Contracts\Services\ContentGenerationServiceInterface;
use Domain\ContentGeneration\DTOs\GeneratedContentDTO;
use Domain\ContentGeneration\Requests\GenerateContentRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContentGenerationService
    implements ContentGenerationServiceInterface
{
    public function generateCopy(
        GenerateContentRequest $request
    ): GeneratedContentDTO {
        $platform        = $request->platform;
        $aiAnalysis      = $request->ai_analysis;
        $questionAnswers = $request->question_answers;

        $prompt = $this->buildPrompt(
            $platform,
            $aiAnalysis,
            $questionAnswers
        );

        $copy = $this->callGemini($prompt, $platform);
        $copy = $this->validateAndFixCopy($platform, $copy);

        return new GeneratedContentDTO($platform, $copy);
    }

    // ─── PROMPT BUILDER ─────────────────────────────────────────
    private function buildPrompt(
        string $platform,
        array  $aiAnalysis,
        array  $answers
    ): string {
        $analysisText = "PRODUCT INTELLIGENCE (from image analysis):
- Product: {$aiAnalysis['product_name']}
- Category: {$aiAnalysis['category']}
- Quality Level: {$aiAnalysis['quality_level']}
- Vibe/Mood: " . implode(', ', $aiAnalysis['vibe'] ?? []) . "
- Likely Audience: {$aiAnalysis['likely_audience']}";

        $platformPrompts = [
            'google' => $this->buildGooglePrompt($analysisText, $answers),
            'meta'   => $this->buildMetaPrompt($analysisText, $answers),
            'snapchat' => $this->buildSnapchatPrompt($analysisText, $answers),
        ];

        return $platformPrompts[$platform];
    }

    private function buildGooglePrompt(
        string $analysisText,
        array  $answers
    ): string {
        return "You are a Google Ads expert copywriter.

{$analysisText}

BUSINESS CONTEXT (from advertiser):
- Campaign Type: " . ($answers['campaign_type'] ?? 'Search') . "
- Main Keyword: " . ($answers['main_keyword'] ?? 'not specified') . "
- Landing Page: " . ($answers['landing_page_url'] ?? 'not specified') . "
- Conversion Goal: " . ($answers['conversion_goal'] ?? 'Purchase') . "
- Geographic Target: " . ($answers['geographic_targeting'] ?? 'Pakistan') . "
- Trust Signals: " . implode(', ', (array)($answers['trust_signals'] ?? [])) . "
- Competitors: " . ($answers['competitors'] ?? 'not specified') . "
- Phone Number: " . ($answers['phone_number'] ?? 'none') . "

Generate a COMPLETE Google Ads RSA package.
Return ONLY valid JSON, no markdown, no backticks:

{
  \"headlines\": [
    \"headline text here\",
    ... exactly 15 headlines, each STRICTLY under 30 characters
  ],
  \"descriptions\": [
    \"description text here\",
    ... exactly 4 descriptions, each STRICTLY under 90 characters
  ],
  \"sitelinks\": [
    \"Sitelink Text\",
    ... exactly 4 sitelinks
  ],
  \"callouts\": [
    \"Callout text\",
    ... exactly 8 callouts, each under 25 characters
  ],
  \"keyword_clusters\": {
    \"broad\": [\"keyword1\", \"keyword2\", \"keyword3\"],
    \"phrase\": [\"keyword1\", \"keyword2\", \"keyword3\"],
    \"exact\": [\"keyword1\", \"keyword2\", \"keyword3\"]
  }
}

CRITICAL RULES:
- Every headline MUST be 30 characters or fewer — count carefully
- Every description MUST be 90 characters or fewer — count carefully
- Callouts MUST be 25 characters or fewer
- Use the main keyword naturally in at least 5 headlines
- Make copy specific to the product and audience detected
- Do NOT use placeholder text like [keyword] or {brand}";
    }

    private function buildMetaPrompt(
        string $analysisText,
        array  $answers
    ): string {
        return "You are a Meta Ads expert copywriter.

{$analysisText}

BUSINESS CONTEXT (from advertiser):
- Campaign Goal: " . ($answers['campaign_goal'] ?? 'Sales') . "
- Offer/Discount: " . ($answers['offer'] ?? 'none') . "
- Target Location: " . ($answers['target_location'] ?? 'Pakistan') . "
- Price Range: " . ($answers['price_range'] ?? 'not specified') . "
- User Action: " . ($answers['user_action'] ?? 'Website') . "
- Brand Tone: " . ($answers['brand_tone'] ?? 'Professional') . "
- Top USPs: " . implode(', ', (array)($answers['usps'] ?? [])) . "
- Customer Problem Solved: " . ($answers['customer_problem'] ?? 'not specified') . "

Generate a COMPLETE Meta Ads copy package.
Return ONLY valid JSON, no markdown, no backticks:

{
  \"primary_texts\": [
    {\"type\": \"emotional\", \"text\": \"full primary text here (max 500 chars)\"},
    {\"type\": \"offer_focused\", \"text\": \"full primary text here (max 500 chars)\"},
    {\"type\": \"problem_solution\", \"text\": \"full primary text here (max 500 chars)\"}
  ],
  \"headlines\": [
    \"headline 1\",
    ... exactly 5 headlines, each under 255 characters
  ],
  \"link_descriptions\": [
    \"description 1\",
    \"description 2\",
    \"description 3\"
  ],
  \"carousel_cards\": [
    {\"headline\": \"card headline\", \"description\": \"card description\"},
    ... exactly 5 carousel cards
  ],
  \"video_scripts\": {
    \"fifteen_second\": [
      { \"timestamp\": \"0:00-0:03\", \"visual_cue\": \"Camera pan...\", \"voiceover\": \"spoken words...\", \"other_details\": \"text on screen...\" }
    ],
    \"thirty_second\": [
      { \"timestamp\": \"0:00-0:05\", \"visual_cue\": \"...\", \"voiceover\": \"...\", \"other_details\": \"...\" }
    ]
  }
}

CRITICAL RULES:
- Return ONLY valid JSON. Double-check your brackets. Do not include markdown formatting.
- Primary texts must feel human, emotional, and platform-native
- If there is an offer, lead with it in the offer_focused variant
- Carousel cards must each highlight a different product benefit
- Act as a full director for video scripts: include visual cues, spoken words, and accurate timestamps. Always start with a strong hook.";
    }

    private function buildSnapchatPrompt(
        string $analysisText,
        array  $answers
    ): string {
        return "You are a Snapchat Ads expert copywriter.

{$analysisText}

BUSINESS CONTEXT (from advertiser):
- Target Age Group: " . ($answers['target_age_group'] ?? '18-24') . "
- Campaign Goal: " . ($answers['campaign_goal'] ?? 'Awareness') . "
- Ad Format: " . ($answers['ad_format'] ?? 'Single Image') . "
- Offer: " . ($answers['offer'] ?? 'none') . "
- User Action (CTA): " . ($answers['user_action'] ?? 'Swipe Up') . "
- Trend/Meme Style: " . ($answers['trend_style'] ?? 'No') . "
- Brand in 3 Words: " . implode(', ', (array)($answers['brand_words'] ?? [])) . "
- Content Type: " . ($answers['content_type'] ?? 'Image') . "

Generate a COMPLETE Snapchat Ads copy package.
Return ONLY valid JSON, no markdown, no backticks:

{
  \"single_ad\": {
    \"brand_name\": \"max 25 characters — count carefully\",
    \"headline\": \"max 34 characters — count carefully\",
    \"body\": \"max 130 characters\",
    \"cta\": \"Swipe Up\"
  },
  \"story_sequence\": [
    {\"slide\": 1, \"text\": \"hook text — 3 seconds\"},
    {\"slide\": 2, \"text\": \"build text\"},
    {\"slide\": 3, \"text\": \"reveal/offer\"},
    {\"slide\": 4, \"text\": \"CTA slide\"},
    {\"slide\": 5, \"text\": \"closing slide\"}
  ],
  \"video_scripts\": {
    \"three_second_hooks\": [
      { \"timestamp\": \"0:00-0:03\", \"visual_cue\": \"...\", \"voiceover\": \"...\", \"other_details\": \"...\" },
      { \"timestamp\": \"0:00-0:03\", \"visual_cue\": \"...\", \"voiceover\": \"...\", \"other_details\": \"...\" }
    ],
    \"ten_second_script\": [
      { \"timestamp\": \"0:00-0:03\", \"visual_cue\": \"...\", \"voiceover\": \"...\", \"other_details\": \"...\" },
      { \"timestamp\": \"0:03-0:10\", \"visual_cue\": \"...\", \"voiceover\": \"...\", \"other_details\": \"...\" }
    ]
  }
}

CRITICAL RULES:
- brand_name MUST be 25 characters or fewer — hard platform limit
- headline MUST be 34 characters or fewer — hard platform limit
- body MUST be 130 characters or fewer
- Tone must match the age group — younger = more casual/trendy
- If trend_style is Yes, use Gen Z language and energy
- Act as a full director for video scripts: include visual cues, spoken words, and accurate timestamps. Always start with a strong hook.";
    }

    // ─── GEMINI API CALL ────────────────────────────────────────
    private function callGemini(
        string $prompt,
        string $platform
    ): array {
        try {
            $response = Http::timeout(45)->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key='
                    . config('services.gemini.key'),
                [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'temperature'      => 0.7,
                        'maxOutputTokens'  => 2048,
                        'responseMimeType' => 'application/json',
                    ],
                ]
            );

            if ($response->successful()) {
                $text = $response->json(
                    'candidates.0.content.parts.0.text'
                );
                
                \Illuminate\Support\Facades\Log::info('RAW AI RESPONSE: ' . $text);
                
                // If it's wrapped in markdown, strip it
                if (preg_match('/```(?:json)?\s*(.*?)\s*```/s', $text, $matches)) {
                    $text = $matches[1];
                }
                
                // Extract everything between the first { and the last }
                if (preg_match('/\{.*\}/s', trim($text), $matches)) {
                    // Strip bold markdown asterisks just in case
                    $jsonString = str_replace('**', '', $matches[0]);
                    
                    // Sometimes Gemini appends extra trailing brackets accidentally. Clean them if present.
                    // This regex removes trailing characters after the last closing brace.
                    $jsonString = preg_replace('/\}\s*\]\s*\}\s*$/', '}', $jsonString);

                    $data = json_decode($jsonString, true);

                    if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                        return $data;
                    } else {
                        \Illuminate\Support\Facades\Log::warning(
                            "ContentGenerationService: JSON decode error: " . json_last_error_msg() . " | String: " . substr($jsonString, -100)
                        );
                    }
                } else {
                    \Illuminate\Support\Facades\Log::warning("ContentGenerationService: Could not extract JSON structure from response.");
                }
            }

        } catch (\Exception $e) {
            Log::error(
                'ContentGenerationService Gemini call failed: '
                . $e->getMessage()
            );
        }

        return $this->getFallbackCopy($platform);
    }

    // ─── SERVER-SIDE VALIDATION & AUTO-FIX ──────────────────────
    public function validateAndFixCopy(
        string $platform,
        array  $copy
    ): array {
        if ($platform === 'google') {
            // Validate headlines — must be ≤30 chars
            if (isset($copy['headlines'])) {
                $copy['headlines'] = array_map(
                    function (string $h) {
                        if (mb_strlen($h) > 30) {
                            // Truncate at last space before limit
                            return rtrim(
                                mb_substr($h, 0, 30)
                            );
                        }
                        return $h;
                    },
                    $copy['headlines']
                );
                // Flag overlong headlines for frontend display
                $copy['headline_violations'] = array_map(
                    fn($h) => mb_strlen($h),
                    $copy['headlines']
                );
            }

            // Validate descriptions — must be ≤90 chars
            if (isset($copy['descriptions'])) {
                $copy['descriptions'] = array_map(
                    function (string $d) {
                        return mb_strlen($d) > 90
                            ? rtrim(mb_substr($d, 0, 90))
                            : $d;
                    },
                    $copy['descriptions']
                );
            }
        }

        if ($platform === 'snapchat') {
            // Hard limits — enforce strictly
            if (isset($copy['single_ad']['brand_name'])) {
                $copy['single_ad']['brand_name'] = mb_substr(
                    $copy['single_ad']['brand_name'], 0, 25
                );
            }
            if (isset($copy['single_ad']['headline'])) {
                $copy['single_ad']['headline'] = mb_substr(
                    $copy['single_ad']['headline'], 0, 34
                );
            }
            if (isset($copy['single_ad']['body'])) {
                $copy['single_ad']['body'] = mb_substr(
                    $copy['single_ad']['body'], 0, 130
                );
            }
        }

        return $copy;
    }

    // ─── FALLBACK COPY (if Gemini fails) ────────────────────────
    private function getFallbackCopy(string $platform): array
    {
        return match($platform) {
            'google' => [
                'headlines'    => array_fill(0, 15, 'Quality Products'),
                'descriptions' => array_fill(0, 4,
                    'Shop our premium collection today.'),
                'sitelinks'    => ['Shop Now', 'About Us',
                    'Contact', 'Offers'],
                'callouts'     => array_fill(0, 8, 'Free Shipping'),
                'keyword_clusters' => [
                    'broad'  => [],
                    'phrase' => [],
                    'exact'  => [],
                ],
                '_fallback' => true,
                '_message'  => 'AI generation failed. Please retry.',
            ],
            'meta' => [
                'primary_texts'    => [],
                'headlines'        => [],
                'link_descriptions'=> [],
                'carousel_cards'   => [],
                'video_scripts'    => [],
                '_fallback' => true,
                '_message'  => 'AI generation failed. Please retry.',
            ],
            'snapchat' => [
                'single_ad'      => [
                    'brand_name' => 'Your Brand',
                    'headline'   => 'Check This Out',
                    'body'       => 'Swipe up to learn more.',
                    'cta'        => 'Swipe Up',
                ],
                'story_sequence' => [],
                'video_scripts'  => [],
                '_fallback' => true,
                '_message'  => 'AI generation failed. Please retry.',
            ],
            default => ['_fallback' => true],
        };
    }
}
