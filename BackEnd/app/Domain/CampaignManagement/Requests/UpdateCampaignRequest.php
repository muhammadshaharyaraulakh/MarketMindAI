<?php

namespace App\Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $objectiveMap = [
            'awareness' => 'awareness',
            'consideration' => 'engagement',
            'conversion' => 'sales'
        ];

        $mergeData = [];
        if ($this->has('platform')) $mergeData['platform'] = strtolower($this->platform);
        if ($this->has('budget_type')) $mergeData['budget_type'] = strtolower($this->budget_type);
        if ($this->has('budget')) $mergeData['budget_amount'] = $this->budget;
        if ($this->has('objective')) $mergeData['objective'] = $objectiveMap[strtolower($this->objective)] ?? strtolower($this->objective);
        if ($this->has('startDate')) $mergeData['start_date'] = $this->startDate;
        if ($this->has('endDate')) $mergeData['end_date'] = empty($this->endDate) ? null : $this->endDate;

        $this->merge($mergeData);
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'platform' => 'sometimes|in:google,meta,snapchat',
            'objective' => 'sometimes|in:awareness,traffic,leads,sales,app_installs,video_views,engagement',
            'budget_amount' => 'sometimes|numeric|min:1',
            'budget_type' => 'sometimes|in:daily,lifetime',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'auto_sync' => 'sometimes|boolean',
        ];
    }
}
