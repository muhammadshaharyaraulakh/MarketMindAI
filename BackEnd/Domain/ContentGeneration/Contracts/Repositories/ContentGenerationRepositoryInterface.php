<?php
namespace Domain\ContentGeneration\Contracts\Repositories;

use App\Models\ContentGeneration;
use Domain\ContentGeneration\DTOs\SavedGenerationDTO;
use Illuminate\Support\Collection;

interface ContentGenerationRepositoryInterface
{
    public function save(SavedGenerationDTO $dto): ContentGeneration;
    public function findByUser(int $userId): Collection;
    public function findById(int $id, int $userId): ?ContentGeneration;
    public function delete(int $id, int $userId): bool;
    public function deleteExpired(): int;
}
