<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{
    public function addRecoveryEmail(Request $request)
    {
        $validation = $request->validate([
            'recovery_email' => 'required|email|unique:users,recovery_email',
        ]);
        $user = $request->user();
        if ($request->recovery_email === $user->email) {
            return response()->json([
                'success' => false,
                'message' => 'The recovery email must be different from your primary email.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $user->recovery_email = $request->recovery_email;
        $user->save();

        return response()->json(['message' => 'Recover email added successfully']);
    }

    public function removeRecoveryEmail(Request $request)
    { 
        $user = $request->user();
        $user->recovery_email = null;
        $user->save();

        return response()->json(['message' => 'Recover email removed successfully']);
    }
    public function updateRecoveryEmail(Request $request)
    {
        $user = $request->user();

        $validation = $request->validate([
            'recovery_email' => 'required|email|unique:users,recovery_email,' . $user->id,
        ]);
        if ($request->recovery_email === $user->email) {
            return response()->json([
                'success' => false,
                'message' => 'The recovery email must be different from your primary email.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user->recovery_email = $request->recovery_email;
        $user->save();

        return response()->json(['message' => 'Recover email updated successfully']);
    }
}
