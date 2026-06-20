<?php

namespace Domain\Reports\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateReportRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'campaign_id' => 'required|integer',
            'report_type' => 'required|in:performance_summary,ai_insights,campaign_breakdown,full_analytics',
        ];
    }
}
