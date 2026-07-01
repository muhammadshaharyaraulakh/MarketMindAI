<?php
namespace App\App\Domain\ContentGeneration\Services;

use App\App\Domain\ContentGeneration\Contracts\Services\ImageAnalysisServiceInterface;
use App\App\Domain\ContentGeneration\DTOs\ImageAnalysisDTO;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageAnalysisService implements ImageAnalysisServiceInterface
{
    public function storeImage(
        UploadedFile $file,
        int $userId
    ): string {
        $filename = 'cgen_' . $userId . '_' . time()
            . '_' . uniqid()
            . '.' . $file->getClientOriginalExtension();

        return $file->storeAs(
            '',
            $filename,
            'content_generation'
            // private local disk defined in filesystems.php
        );
    }

    public function analyzeImage(string $imagePath): ImageAnalysisDTO
    {
        // Read image from local storage and base64 encode
        $imageContents = Storage::disk('content_generation')
            ->get($imagePath);
        $base64Image   = base64_encode($imageContents);

        // Detect mime type from extension
        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
        $mimeType  = match(strtolower($extension)) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png'         => 'image/png',
            'webp'        => 'image/webp',
            default       => 'image/jpeg',
        };

        $prompt = 'Analyze this product image and return ONLY 
a valid JSON object with NO markdown, NO backticks, 
NO explanation text. Just the raw JSON.

Required JSON structure:
{
  "product_name": "short product name e.g. Running Shoes",
  "category": "product category e.g. Sports / Footwear",
  "quality_level": "one of: Budget, Mid-range, Premium",
  "vibe": ["tag1", "tag2", "tag3"],
  "colors": [
    {"hex": "#1A1A2E", "name": "Dark Navy"},
    {"hex": "#E94560", "name": "Coral Red"}
  ],
  "likely_audience": "e.g. Males, 18-34, fitness enthusiasts"
}

Detect these from the image only. Do not guess or assume 
anything not visible. Return ONLY the JSON object.';

        try {
            $response = Http::timeout(30)->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key='
                    . config('services.gemini.key'),
                [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data'      => $base64Image,
                                    ],
                                ],
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature'      => 0.1,
                        'maxOutputTokens'  => 400,
                        'responseMimeType' => 'application/json',
                    ],
                ]
            );

            if ($response->successful()) {
                $text = $response->json(
                    'candidates.0.content.parts.0.text'
                );

                // Clean markdown code blocks if the model ignored responseMimeType
                $cleanedText = preg_replace('/```json\s*/i', '', $text);
                $cleanedText = preg_replace('/```\s*/', '', $cleanedText);
                $cleanedText = trim($cleanedText);

                $data = json_decode($cleanedText, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                    return ImageAnalysisDTO::fromGeminiResponse($data);
                }

                // JSON parse failed — retry once with stricter prompt
                Log::warning('Image analysis: JSON parse failed. Error: ' . json_last_error_msg() . ' Raw text: ' . $text);
                return $this->retryAnalysis($base64Image, $mimeType);
            } else {
                Log::error('Gemini Image Analysis API Error: ' . $response->body());
            }

        } catch (\Exception $e) {
            Log::error('ImageAnalysisService: ' . $e->getMessage());
        }

        // Fallback — return sensible defaults so wizard can continue
        return ImageAnalysisDTO::fromGeminiResponse([
            'product_name'    => 'Your Product',
            'category'        => 'General',
            'quality_level'   => 'Mid-range',
            'vibe'            => ['Professional'],
            'colors'          => [['hex' => '#000000', 'name' => 'Black']],
            'likely_audience' => 'General audience, 18-45',
        ]);
    }

    private function retryAnalysis(
        string $base64Image,
        string $mimeType
    ): ImageAnalysisDTO {
        try {
            $response = Http::timeout(30)->post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key='
                    . config('services.gemini.key'),
                [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data'      => $base64Image,
                                    ],
                                ],
                                [
                                    'text' => 'Return ONLY this JSON, nothing else:
{"product_name":"...","category":"...","quality_level":"Budget|Mid-range|Premium","vibe":["..."],"colors":[{"hex":"#xxxxxx","name":"..."}],"likely_audience":"..."}'
                                ],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature'      => 0.0,
                        'responseMimeType' => 'application/json'
                    ],
                ]
            );

            $text = $response->json(
                'candidates.0.content.parts.0.text'
            );
            
            $cleanedText = preg_replace('/```json\s*/i', '', $text);
            $cleanedText = preg_replace('/```\s*/', '', $cleanedText);
            $cleanedText = trim($cleanedText);

            $data = json_decode($cleanedText, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                return ImageAnalysisDTO::fromGeminiResponse($data);
            } else {
                Log::error('ImageAnalysisService retry JSON parse failed. Error: ' . json_last_error_msg() . ' Raw: ' . $text);
            }
        } catch (\Exception $e) {
            Log::error('ImageAnalysisService retry failed: '
                . $e->getMessage());
        }

        return ImageAnalysisDTO::fromGeminiResponse([]);
    }

    public function deleteImage(string $imagePath): void
    {
        Storage::disk('content_generation')->delete($imagePath);
    }
}
