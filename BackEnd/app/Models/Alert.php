<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [
        'user_id',
        'campaign_id',
        'campaign_name',
        'platform',
        'severity',
        'alert_type',
        'title',
        'detail',
        'metric_before',
        'metric_after',
        'percent_change',
        'status',
        'triggered_at',
    ];

    protected $casts = [
        'metric_before' => 'decimal:4',
        'metric_after' => 'decimal:4',
        'percent_change' => 'decimal:2',
        'triggered_at' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    public function recommendation()
    {
        return $this->hasOne(Recommendation::class);
    }
}
