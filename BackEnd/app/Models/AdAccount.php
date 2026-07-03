<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdAccount extends Model
{
    /** @use HasFactory<\Database\Factories\AdAccountFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'credentials' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function audiences()
    {
        return $this->hasMany(Audience::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function csvUploads()
    {
        return $this->hasMany(CsvUpload::class);
    }
}
