<?php
namespace App\App\Domain\ContentGeneration\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeImageRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'file',
                'mimes:jpeg,jpg,png,webp',
                'max:5120', // 5MB max
            ],
        ];
    }
}
