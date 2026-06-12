<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\JsonResponse;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $token = $request->user()->createToken($request->userAgent() ?: 'auth_token')->plainTextToken;

        return new JsonResponse([
            'message' => 'Authenticated.',
            'two_factor' => false,
            'token' => $token,
            'user' => $request->user(),
        ], 200);
    }
}
