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

    public function getSessions(Request $request)
    {
        $tokens = $request->user()->tokens()->orderBy('last_used_at', 'desc')->get()->map(function ($token) use ($request) {
            $agent = $token->name;
            $browser = 'API Token';
            $os = 'Unknown Device';
            $type = 'desktop';

            if (preg_match('/(?:MSIE |Trident\/.*; rv:|Edge\/|Edg\/)(\d+)/', $agent)) {
                $browser = 'Microsoft Edge';
            } elseif (preg_match('/Firefox\/(\d+)/', $agent)) {
                $browser = 'Mozilla Firefox';
            } elseif (preg_match('/Chrome\/(\d+)/', $agent)) {
                $browser = 'Google Chrome';
            } elseif (preg_match('/Safari\/(\d+)/', $agent)) {
                $browser = 'Apple Safari';
            } elseif ($agent === 'auth_token') {
                $browser = 'Legacy API Token';
            }

            if (preg_match('/Windows NT 10.0/', $agent)) {
                $os = 'Windows 10/11';
            } elseif (preg_match('/Windows NT/', $agent)) {
                $os = 'Windows';
            } elseif (preg_match('/Mac OS X/', $agent)) {
                $os = 'Mac OS';
            } elseif (preg_match('/Linux/', $agent)) {
                $os = 'Linux';
            } elseif (preg_match('/Android/', $agent)) {
                $os = 'Android';
                $type = 'mobile';
            } elseif (preg_match('/iPhone|iPad/', $agent)) {
                $os = 'iOS';
                $type = 'mobile';
            }

            return [
                'id' => $token->id,
                'isCurrent' => $request->user()->currentAccessToken() && $token->id === $request->user()->currentAccessToken()->id,
                'last_active' => $token->last_used_at ? \Carbon\Carbon::parse($token->last_used_at)->diffForHumans() : 'Never',
                'browser' => $browser,
                'os' => $os,
                'type' => $type,
            ];
        });

        return response()->json($tokens);
    }

    public function logoutOtherDevices(Request $request)
    {
        if ($request->user()->currentAccessToken()) {
            $request->user()->tokens()
                ->where('id', '!=', $request->user()->currentAccessToken()->id)
                ->delete();
        }

        return response()->json(['message' => 'Other devices logged out successfully.']);
    }

    public function logoutSpecificDevice(Request $request, $id)
    {
        $request->user()->tokens()->where('id', $id)->delete();

        return response()->json(['message' => 'Device session revoked successfully.']);
    }
}
