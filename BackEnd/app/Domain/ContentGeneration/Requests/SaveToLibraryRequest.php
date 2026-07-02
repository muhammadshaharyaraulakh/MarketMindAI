<?php
namespace App\Domain\ContentGeneration\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveToLibraryRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'image_path'       => ['nullable', 'string'],
            'ai_analysis'      => ['required', 'array'],
            'platform'         => ['required', 'in:google,meta,snapchat,email'],
            'question_answers' => ['required', 'array'],
            'generated_copy'   => ['required', 'array'],
        ];
    }
}
