<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdAnalytic extends Model
{
    /** @use HasFactory<\Database\Factories\AdAnalyticFactory> */
    use HasFactory;

    protected $guarded = [];

    public function entity()
    {
        return $this->morphTo();
    }
}
