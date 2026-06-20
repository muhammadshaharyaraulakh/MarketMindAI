<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'campaign_id',
        'campaign_name',
        'report_type',
        'status',
        'completed_sections',
        'total_sections',
        'progress_percent',
        'pdf_path',
        'pdf_size_bytes',
        'generation_time_seconds',
        'error_message',
        'job_id',
    ];

    protected $casts = [
        'completed_sections' => 'array',
    ];
}
