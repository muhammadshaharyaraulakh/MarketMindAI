<?php

namespace App\App\Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\AdSet;

class StoreAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $mergeData = [];
        if ($this->has('adSetId')) $mergeData['ad_set_id'] = $this->adSetId;
        if ($this->has('format')) $mergeData['ad_format'] = strtolower($this->format);
        if ($this->has('destinationUrl')) $mergeData['destination_url'] = $this->destinationUrl;
        if ($this->has('ctaType')) $mergeData['cta_type'] = strtolower($this->ctaType);
        if ($this->has('abTestGroup')) $mergeData['ab_test_group'] = $this->abTestGroup;
        if ($this->has('utmSource')) $mergeData['utm_source'] = $this->utmSource;
        if ($this->has('utmMedium')) $mergeData['utm_medium'] = $this->utmMedium;
        if ($this->has('utmCampaign')) $mergeData['utm_campaign'] = $this->utmCampaign;
        if ($this->has('primaryText')) $mergeData['primary_text'] = $this->primaryText;
        if ($this->has('linkDescription')) $mergeData['link_description'] = $this->linkDescription;
        if ($this->has('instagram')) $mergeData['instagram_placement'] = $this->instagram;

        $this->merge($mergeData);
    }

    public function rules(): array
    {
        $rules = [
            'ad_set_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $adSet = AdSet::with('campaign')->find($value);
                    if (!$adSet || !$adSet->campaign || $adSet->campaign->user_id !== auth()->id()) {
                        $fail('The selected ad set is invalid or does not belong to you.');
                    }
                },
            ],
            'name' => 'required|string|max:255',
            'ad_format' => 'required|in:image,video,carousel,responsive,story,collection',
            'destination_url' => 'required|url',
            'cta_type' => 'required|in:shop_now,learn_more,sign_up,contact_us,book_now,download,subscribe',
            'ab_test_group' => 'nullable|in:A,B,C',
            'utm_source' => 'nullable|string',
            'utm_medium' => 'nullable|string',
            'utm_campaign' => 'nullable|string',
            'initial_spend' => 'nullable|numeric|min:0',
            'initial_impressions' => 'nullable|integer|min:0',
            'initial_clicks' => 'nullable|integer|min:0',
            'initial_conversions' => 'nullable|integer|min:0',
        ];

        $adSetId = $this->input('ad_set_id');
        if ($adSetId) {
            $adSet = AdSet::with('campaign')->find($adSetId);
            if ($adSet && $adSet->campaign) {
                $platform = strtolower($adSet->campaign->platform);
                
                if ($platform === 'google') {
                    $rules['headlines'] = 'required|array|min:1|max:15';
                    $rules['headlines.*'] = 'string|max:30';
                    $rules['descriptions'] = 'required|array|min:1|max:4';
                    $rules['descriptions.*'] = 'string|max:90';
                } elseif ($platform === 'meta') {
                    $rules['primary_text'] = 'required|string|max:500';
                    $rules['headline'] = 'required|string|max:40';
                    $rules['link_description'] = 'nullable|string|max:200';
                    $rules['page_id'] = 'nullable|string';
                    $rules['instagram_placement'] = 'boolean';
                } elseif ($platform === 'snapchat') {
                    $rules['brand_name'] = 'required|string|max:25';
                    $rules['headline'] = 'required|string|max:34';
                    $rules['attachment_url'] = 'nullable|url';
                }
            }
        }

        return $rules;
    }
}
