<?php
namespace App\App\Domain\ContentGeneration\Contracts\Services;

use App\App\Domain\ContentGeneration\DTOs\ImageAnalysisDTO;
use Illuminate\Http\UploadedFile;

interface ImageAnalysisServiceInterface
{
    public function storeImage(UploadedFile $file, int $userId): string;
    public function analyzeImage(string $imagePath): ImageAnalysisDTO;
    public function deleteImage(string $imagePath): void;
}
