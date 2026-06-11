<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;

class ApiVerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return new JsonResponse(['message' => 'Invalid verification link'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            $token = $user->createToken('auth_token')->plainTextToken;
            return new JsonResponse(['message' => 'Email already verified', 'token' => $token], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return new JsonResponse(['message' => 'Email verified successfully', 'token' => $token], 200);
    }
}
