<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdCreative extends Model
{
    /** @use HasFactory<\Database\Factories\AdCreativeFactory> */
    use HasFactory;

    protected $guarded = [];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
