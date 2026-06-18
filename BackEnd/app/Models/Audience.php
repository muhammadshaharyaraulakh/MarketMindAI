<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audience extends Model
{
    /** @use HasFactory<\Database\Factories\AudienceFactory> */
    use HasFactory;

    protected $guarded = [];

    public function adAccount()
    {
        return $this->belongsTo(AdAccount::class);
    }

    public function adSets()
    {
        return $this->hasMany(AdSet::class);
    }
}
