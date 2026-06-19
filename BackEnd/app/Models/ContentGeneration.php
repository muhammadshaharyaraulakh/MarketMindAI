<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ContentGeneration extends Model
{
    protected $table = 'content_generations';

    protected $fillable = [
        'user_id',
        'image_path',
        'ai_analysis',
        'platform',
        'question_answers',
        'generated_copy',
        'expires_at',
    ];

    protected $casts = [
        'ai_analysis'      => 'array',
        'question_answers' => 'array',
        'generated_copy'   => 'array',
        'expires_at'       => 'datetime',
    ];

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', Carbon::now());
    }

    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', Carbon::now());
    }
}
