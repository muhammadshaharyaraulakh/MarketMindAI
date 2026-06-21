<?php

namespace Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
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

        $this->merge([
            'platform' => $this->platform ? strtolower($this->platform) : null,
            'budget_type' => $this->budget_type ? strtolower($this->budget_type) : null,
            'budget_amount' => $this->budget ?? $this->budget_amount,
            'objective' => $this->objective ? ($objectiveMap[strtolower($this->objective)] ?? strtolower($this->objective)) : null,
            'start_date' => $this->startDate ?? $this->start_date,
            'end_date' => empty($this->endDate) && empty($this->end_date) ? null : ($this->endDate ?? $this->end_date),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'platform' => 'required|in:google,meta,snapchat',
            'objective' => 'required|in:awareness,traffic,leads,sales,app_installs,video_views,engagement',
            'budget_amount' => 'required|numeric|min:1',
            'budget_type' => 'required|in:daily,lifetime',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'auto_sync' => 'boolean',
        ];
    }
}
