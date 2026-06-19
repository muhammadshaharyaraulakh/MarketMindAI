<?php
namespace App\Jobs;

use App\Models\ContentGeneration;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteExpiredGenerationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue,
        Queueable, SerializesModels;

    public int    $tries   = 3;
    public int    $backoff = 60;

    public function handle(): void
    {
        $expired = ContentGeneration::whereNotNull('image_path')
            ->where('created_at', '<', now()->subHours(24))
            ->get();

        foreach ($expired as $generation) {
            Storage::disk('content_generation')
                ->delete($generation->image_path);

            $generation->delete();
        }

        Log::info(
            'DeleteExpiredGenerationsJob: deleted '
            . $expired->count()
            . ' expired generations and their images.'
        );
    }

    public function failed(\Throwable $exception): void
    {
        Log::error(
            'DeleteExpiredGenerationsJob failed: '
            . $exception->getMessage()
        );
    }
}
