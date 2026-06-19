<?php

namespace App\Domain\DataIngestion\Repositories;

use App\Domain\DataIngestion\Contracts\Repositories\CsvUploadRepositoryInterface;
use App\Models\CsvUpload;

class CsvUploadRepository implements CsvUploadRepositoryInterface
{
    public function createUploadRecord(array $data): CsvUpload
    {
        return CsvUpload::create([
            'user_id' => $data['user_id'],
            'original_filename' => $data['file_name'],
            'stored_path' => $data['file_path'],
            'platform' => $data['platform'] ?? 'google',
            'target_level' => 'campaign',
            'status' => 'processing',
        ]);
    }

    public function updateStatus(int $id, string $status, array $extra = []): void
    {
        $updateData = ['status' => $status];

        if (isset($extra['rows_processed'])) {
            $updateData['rows_processed'] = $extra['rows_processed'];
        }
        if (isset($extra['error_log'])) {
            $updateData['error_log'] = $extra['error_log'];
        }

        CsvUpload::where('id', $id)->update($updateData);
    }
}
