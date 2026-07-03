<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SimulateSyncStatusJob implements ShouldQueue
{
    use Queueable;

    protected string $entityType;
    protected int $entityId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $entityType, int $entityId)
    {
        $this->entityType = $entityType;
        $this->entityId = $entityId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (in_array($this->entityType, ['campaign', 'ad_set'])) {
            $modelClass = $this->entityType === 'campaign' ? \App\Models\Campaign::class : \App\Models\AdSet::class;
            $entity = $modelClass::find($this->entityId);
            
            if ($entity && strtolower($entity->sync_status) === 'pending') {
                $entity->sync_status = 'synced';
                $entity->save();
            }
        } elseif ($this->entityType === 'ad') {
            $ad = \App\Models\Ad::find($this->entityId);
            
            if ($ad && strtolower($ad->review_status) === 'pending') {
                $ad->sync_status = 'synced';
                $ad->review_status = 'APPROVED';
                $ad->status = 'Active'; // Automatically activate it once approved
                $ad->save();
            }
        }
    }
}
