<?php

namespace App\App\Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecordDailyLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => [
                'required',
                'date',
                'before_or_equal:today',
                Rule::unique('ad_analytics', 'date')
                    ->where('entity_type', 'campaign')
                    ->where('entity_id', $this->route('id'))
                    ->ignore($this->route('logId'))
            ],
            'spend' => 'required|numeric|min:0',
            'revenue' => 'required|numeric|min:0',
            'impressions' => 'required|integer|min:0',
            'clicks' => 'required|integer|min:0|lte:impressions',
            'leads' => 'required|integer|min:0',
        ];
    }
    
    public function messages(): array
    {
        return [
            'date.before_or_equal' => 'The date cannot be in the future.',
            'date.unique' => 'A daily log already exists for this date. Please edit the existing entry instead.',
            'clicks.lte' => 'Clicks cannot exceed impressions.',
        ];
    }
}
