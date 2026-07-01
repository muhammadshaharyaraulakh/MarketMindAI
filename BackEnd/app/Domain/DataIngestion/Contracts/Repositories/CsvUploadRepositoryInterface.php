<?php

namespace App\App\Domain\DataIngestion\Contracts\Repositories;

use App\Models\CsvUpload;

interface CsvUploadRepositoryInterface
{
    public function createUploadRecord(array $data): CsvUpload;
    public function updateStatus(int $id, string $status, array $extra = []): void;
}
