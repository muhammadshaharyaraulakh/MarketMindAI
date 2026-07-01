<?php

namespace App\Domain\ChatbotGeneral\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|integer',
        ];
    }
}
