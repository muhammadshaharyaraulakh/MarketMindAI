<?php
namespace App\Domain\ContentGeneration\Contracts\Services;

use App\Domain\ContentGeneration\DTOs\GeneratedContentDTO;
use App\Domain\ContentGeneration\Requests\GenerateContentRequest;

interface ContentGenerationServiceInterface
{
    public function generateCopy(
        GenerateContentRequest $request
    ): GeneratedContentDTO;

    public function validateAndFixCopy(
        string $platform,
        array  $copy
    ): array;
}
