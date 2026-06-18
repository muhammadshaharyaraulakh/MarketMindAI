<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdGoogleDetail extends Model
{
    /** @use HasFactory<\Database\Factories\AdGoogleDetailFactory> */
    use HasFactory;

    protected $guarded = [];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
