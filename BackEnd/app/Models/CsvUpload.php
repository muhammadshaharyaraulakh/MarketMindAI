<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CsvUpload extends Model
{
    /** @use HasFactory<\Database\Factories\CsvUploadFactory> */
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function adAccount()
    {
        return $this->belongsTo(AdAccount::class);
    }
}
