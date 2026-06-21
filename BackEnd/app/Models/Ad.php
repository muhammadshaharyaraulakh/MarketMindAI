<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Ad extends Model
{
    use HasFactory, HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $guarded = [];

    public function adSet()
    {
        return $this->belongsTo(AdSet::class);
    }

    public function creatives()
    {
        return $this->hasMany(AdCreative::class);
    }

    public function googleDetail()
    {
        return $this->hasOne(AdGoogleDetail::class);
    }

    public function metaDetail()
    {
        return $this->hasOne(AdMetaDetail::class);
    }

    public function snapchatDetail()
    {
        return $this->hasOne(AdSnapchatDetail::class);
    }

    public function analytics()
    {
        return $this->morphMany(AdAnalytic::class, 'entity');
    }
}
