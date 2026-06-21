<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $fillable = [
        'alert_id',
        'recommendation_text',
        'category',
        'applied',
        'dismissed',
        'generated_via_ai',
    ];

    protected $casts = [
        'applied' => 'boolean',
        'dismissed' => 'boolean',
        'generated_via_ai' => 'boolean',
    ];
}
