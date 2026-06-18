<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdMetaDetail extends Model
{
    /** @use HasFactory<\Database\Factories\AdMetaDetailFactory> */
    use HasFactory;

    protected $guarded = [];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
