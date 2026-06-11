<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Illuminate\Http\JsonResponse;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    public function toResponse($request)
    {
        $token = $request->user()->createToken('auth_token')->plainTextToken;

        return new JsonResponse([
            'message' => 'Authenticated.',
            'token' => $token,
            'user' => $request->user(),
        ], 200);
    }
}
