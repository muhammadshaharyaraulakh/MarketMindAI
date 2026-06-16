<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\JsonResponse;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        return new JsonResponse([
            'message' => 'Authenticated.',
            'two_factor' => false,
            'user' => $request->user(),
        ], 200);
    }
}
