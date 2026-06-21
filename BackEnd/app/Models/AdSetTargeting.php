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

    public function adSet()
    {
        return $this->belongsTo(AdSet::class);
    }
}
