<?php

namespace Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecordDailyLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'spend' => 'required|numeric|min:0',
            'revenue' => 'required|numeric|min:0',
            'impressions' => 'required|integer|min:0',
            'clicks' => 'required|integer|min:0',
            'leads' => 'required|integer|min:0',
        ];
    }
}
