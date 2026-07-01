<?php
namespace App\App\Domain\ContentGeneration\Repositories;

use App\Models\ContentGeneration;
use Carbon\Carbon;
use App\App\Domain\ContentGeneration\Contracts\Repositories\ContentGenerationRepositoryInterface;
use App\App\Domain\ContentGeneration\DTOs\SavedGenerationDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ContentGenerationRepository
    implements ContentGenerationRepositoryInterface
{
    public function save(SavedGenerationDTO $dto): ContentGeneration
    {
        return ContentGeneration::create([
            'user_id'          => $dto->userId,
            'image_path'       => $dto->imagePath,
            'ai_analysis'      => $dto->aiAnalysis,
            'platform'         => $dto->platform,
            'question_answers' => $dto->questionAnswers,
            'generated_copy'   => $dto->generatedCopy,
            'expires_at'       => $dto->expiresAt,
        ]);
    }

    public function findByUser(int $userId): Collection
    {
        return ContentGeneration::where('user_id', $userId)
            ->active()
            ->orderByDesc('created_at')
            ->get();
    }

    public function findById(
        int $id,
        int $userId
    ): ?ContentGeneration {
        return ContentGeneration::where('id', $id)
            ->where('user_id', $userId)
            ->active()
            ->first();
    }

    public function delete(int $id, int $userId): bool
    {
        $record = $this->findById($id, $userId);
        if (! $record) return false;
        $record->delete();
        return true;
    }

    public function deleteExpired(): int
    {
        $count = ContentGeneration::expired()->count();
        ContentGeneration::expired()->delete();
        Log::info(
            "ContentGenerationRepository: deleted {$count} expired generations."
        );
        return $count;
    }
}
