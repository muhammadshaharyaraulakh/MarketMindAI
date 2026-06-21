<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AdSet extends Model
{
    use HasFactory, HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $guarded = [];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function audience()
    {
        return $this->belongsTo(Audience::class);
    }

    public function targeting()
    {
        return $this->hasOne(AdSetTargeting::class);
    }

    public function ads()
    {
        return $this->hasMany(Ad::class);
    }

    public function analytics()
    {
        return $this->morphMany(AdAnalytic::class, 'entity');
    }
}
