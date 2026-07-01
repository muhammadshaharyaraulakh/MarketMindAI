<?php
namespace App\App\Domain\ContentGeneration\Contracts\Services;

use App\App\Domain\ContentGeneration\DTOs\GeneratedContentDTO;
use App\App\Domain\ContentGeneration\Requests\GenerateContentRequest;

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
