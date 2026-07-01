<?php
namespace App\Domain\ContentGeneration\DTOs;

class ImageAnalysisDTO
{
    public function __construct(
        public readonly string $productName,
        public readonly string $category,
        public readonly string $qualityLevel,
        public readonly array  $vibe,
        public readonly array  $colors,
        public readonly string $likelyAudience,
    ) {}

    public static function fromGeminiResponse(array $data): self
    {
        return new self(
            productName:    $data['product_name']    ?? 'Unknown Product',
            category:       $data['category']        ?? 'General',
            qualityLevel:   $data['quality_level']   ?? 'Mid-range',
            vibe:           $data['vibe']            ?? [],
            colors:         $data['colors']          ?? [],
            likelyAudience: $data['likely_audience'] ?? 'General audience',
        );
    }

    public function toArray(): array
    {
        return [
            'product_name'    => $this->productName,
            'category'        => $this->category,
            'quality_level'   => $this->qualityLevel,
            'vibe'            => $this->vibe,
            'colors'          => $this->colors,
            'likely_audience' => $this->likelyAudience,
        ];
    }
}
