<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Campaign extends Model
{
    use HasFactory, HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $guarded = [];

    public function adAccount()
    {
        return $this->belongsTo(AdAccount::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function platformMeta()
    {
        return $this->hasOne(CampaignPlatformMeta::class);
    }

    public function adSets()
    {
        return $this->hasMany(AdSet::class);
    }

    public function analytics()
    {
        return $this->morphMany(AdAnalytic::class, 'entity');
    }
}
