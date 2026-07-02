<?php
namespace App\Domain\ContentGeneration\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateContentRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'image_path' => [
                'nullable',
                'string',
            ],
            // image_path is the path returned from /analyze-image
            // null if user skipped image upload

            'ai_analysis' => ['required', 'array'],
            'ai_analysis.product_name'    => ['required', 'string'],
            'ai_analysis.category'        => ['required', 'string'],
            'ai_analysis.quality_level'   => ['required', 'string'],
            'ai_analysis.vibe'            => ['required', 'array'],
            'ai_analysis.colors'          => ['required', 'array'],
            'ai_analysis.likely_audience' => ['required', 'string'],

            'platform' => [
                'required',
                'in:google,meta,snapchat,email',
            ],

            'question_answers' => ['required', 'array'],
            // platform-specific answers, validated loosely here
            // service validates completeness per platform
        ];
    }
}
