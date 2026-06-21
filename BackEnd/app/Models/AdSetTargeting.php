<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdSetTargeting extends Model
{
    /** @use HasFactory<\Database\Factories\AdSetTargetingFactory> */
    use HasFactory;

    protected $table = 'ad_set_targeting';
    protected $guarded = [];

    protected $casts = [
        'genders' => 'array',
        'locations' => 'array',
        'languages' => 'array',
        'interests' => 'array',
        'keywords' => 'array',
        'negative_keywords' => 'array',
    ];

    public function adSet()
    {
        return $this->belongsTo(AdSet::class);
    }
}
