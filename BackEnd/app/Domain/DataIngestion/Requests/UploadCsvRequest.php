<?php

namespace App\App\Domain\DataIngestion\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadCsvRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'file' => 'required|file|mimes:csv,txt|max:10240',
            'platform' => 'required|in:google,meta,snapchat,custom',
        ];
    }
}
