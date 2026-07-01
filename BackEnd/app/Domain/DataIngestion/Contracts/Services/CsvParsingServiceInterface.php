<?php

namespace App\App\Domain\DataIngestion\Contracts\Services;

interface CsvParsingServiceInterface
{
    public function validateHeaders(array $headers): array;
    public function parseFile(string $filePath): array;
    public function insertRows(array $rows, int $userId, int $csvUploadId): array;
}
