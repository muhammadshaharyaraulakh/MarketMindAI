<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Illuminate\Http\JsonResponse;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request)
    {
        return new JsonResponse([
            'message' => 'Authenticated.',
            'user' => $request->user(),
        ], 200);
    }
}
