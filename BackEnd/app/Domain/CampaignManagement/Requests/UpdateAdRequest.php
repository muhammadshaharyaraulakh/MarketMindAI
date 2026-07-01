<?php

namespace App\Domain\CampaignManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Ad;

class UpdateAdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $mergeData = [];
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
            'name' => 'sometimes|string|max:255',
            'ad_format' => 'sometimes|in:image,video,carousel,responsive,story,collection',
            'destination_url' => 'sometimes|url',
            'cta_type' => 'sometimes|in:shop_now,learn_more,sign_up,contact_us,book_now,download,subscribe',
            'ab_test_group' => 'nullable|in:A,B,C',
            'utm_source' => 'nullable|string',
            'utm_medium' => 'nullable|string',
            'utm_campaign' => 'nullable|string',
        ];

        $adId = $this->route('id');
        if ($adId) {
            $ad = Ad::with('adSet.campaign')->find($adId);
            if ($ad && $ad->adSet && $ad->adSet->campaign) {
                $platform = strtolower($ad->adSet->campaign->platform);
                
                if ($platform === 'google') {
                    $rules['headlines'] = 'sometimes|array|min:1|max:15';
                    $rules['headlines.*'] = 'string|max:30';
                    $rules['descriptions'] = 'sometimes|array|min:1|max:4';
                    $rules['descriptions.*'] = 'string|max:90';
                } elseif ($platform === 'meta') {
                    $rules['primary_text'] = 'sometimes|string|max:500';
                    $rules['headline'] = 'sometimes|string|max:40';
                    $rules['link_description'] = 'nullable|string|max:200';
                    $rules['page_id'] = 'nullable|string';
                    $rules['instagram_placement'] = 'boolean';
                } elseif ($platform === 'snapchat') {
                    $rules['brand_name'] = 'sometimes|string|max:25';
                    $rules['headline'] = 'sometimes|string|max:34';
                    $rules['attachment_url'] = 'nullable|url';
                }
            }
        }

        return $rules;
    }
}
