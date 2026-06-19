<?php
namespace Domain\ContentGeneration\Contracts\Services;

use Domain\ContentGeneration\DTOs\GeneratedContentDTO;
use Domain\ContentGeneration\Requests\GenerateContentRequest;

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
