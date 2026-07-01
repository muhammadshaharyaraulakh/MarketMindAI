<?php
namespace App\Domain\ContentGeneration\DTOs;

use Carbon\Carbon;

class SavedGenerationDTO
{
    public function __construct(
        public readonly int    $userId,
        public readonly ?string $imagePath,
        public readonly array  $aiAnalysis,
        public readonly string $platform,
        public readonly array  $questionAnswers,
        public readonly array  $generatedCopy,
        public readonly Carbon $expiresAt,
    ) {}
}
