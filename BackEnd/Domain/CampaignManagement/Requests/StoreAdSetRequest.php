<?php

namespace Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdSetRequest extends FormRequest
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
        if ($this->has('campaignId')) $mergeData['campaign_id'] = $this->campaignId;
        if ($this->has('goal')) $mergeData['optimization_goal'] = $goalMap[strtolower($this->goal)] ?? strtolower($this->goal);
        if ($this->has('audienceType')) $mergeData['audience_type'] = strtolower($this->audienceType);
        if ($this->has('budget_type')) $mergeData['budget_type'] = strtolower($this->budget_type);
        if ($this->has('budget')) $mergeData['budget_amount'] = $this->budget;
        if ($this->has('billingEvent')) $mergeData['billing_event'] = strtolower($this->billingEvent);
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
            'campaign_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $campaign = \App\Models\Campaign::find($value);
                    if (!$campaign || $campaign->user_id !== auth()->id()) {
                        $fail('The selected campaign is invalid or does not belong to you.');
                    }
                },
            ],
            'name' => 'required|string|max:255',
            'optimization_goal' => 'required|in:reach,impressions,link_clicks,landing_page_views,conversions,app_installs,video_views,leads',
            'audience_type' => 'required|in:broad,custom,lookalike',
            'age_min' => 'required|integer|min:13|max:65',
            'age_max' => 'required|integer|min:13|max:65|gte:age_min',
            'locations' => 'nullable|array',
            'interests' => 'nullable|array',
            'budget_type' => 'required|in:daily,lifetime',
            'budget_amount' => 'required|numeric|min:1',
            'billing_event' => 'required|in:cpm,cpc,cpv,cpa,ocpm',
        ];
    }
}
