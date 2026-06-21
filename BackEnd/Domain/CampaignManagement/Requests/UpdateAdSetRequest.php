<?php

namespace Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdSetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $goalMap = [
            'impressions' => 'impressions',
            'clicks' => 'link_clicks',
            'conversions' => 'conversions',
            'reach' => 'reach'
        ];

        $mergeData = [];
        if ($this->has('goal')) $mergeData['optimization_goal'] = $this->goal ? ($goalMap[strtolower($this->goal)] ?? strtolower($this->goal)) : null;
        if ($this->has('audienceType')) $mergeData['audience_type'] = $this->audienceType ? strtolower($this->audienceType) : null;
        if ($this->has('budget_type')) $mergeData['budget_type'] = $this->budget_type ? strtolower($this->budget_type) : null;
        if ($this->has('budget')) $mergeData['budget_amount'] = $this->budget;
        if ($this->has('billingEvent')) $mergeData['billing_event'] = $this->billingEvent ? strtolower($this->billingEvent) : null;
        if ($this->has('locations') && is_string($this->locations)) {
            $mergeData['locations'] = array_map('trim', explode(',', $this->locations));
        }
        if ($this->has('interests') && is_string($this->interests)) {
            $mergeData['interests'] = array_map('trim', explode(',', $this->interests));
        }
        if ($this->has('ageMin')) $mergeData['age_min'] = $this->ageMin;
        if ($this->has('ageMax')) $mergeData['age_max'] = $this->ageMax;

        $this->merge($mergeData);
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'optimization_goal' => 'sometimes|in:reach,impressions,link_clicks,landing_page_views,conversions,app_installs,video_views,leads',
            'audience_type' => 'sometimes|in:broad,custom,lookalike',
            'age_min' => 'sometimes|integer|min:13|max:65',
            'age_max' => 'sometimes|integer|min:13|max:65|gte:age_min',
            'locations' => 'nullable|array',
            'interests' => 'nullable|array',
            'budget_type' => 'sometimes|nullable|in:daily,lifetime',
            'budget_amount' => 'sometimes|numeric|min:1',
            'billing_event' => 'sometimes|in:cpm,cpc,cpv,cpa,ocpm',
        ];
    }
}
