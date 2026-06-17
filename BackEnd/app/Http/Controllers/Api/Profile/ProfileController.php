<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProfileController extends Controller
{
    public function getSessions(Request $request)
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($request) {
                $agent = $session->user_agent;
                $browser = 'Unknown Browser';
                $os = 'Unknown OS';
                $type = 'desktop';

                if (preg_match('/(?:MSIE |Trident\/.*; rv:|Edge\/|Edg\/)(\d+)/', $agent)) {
                    $browser = 'Microsoft Edge';
                } elseif (preg_match('/Firefox\/[\d.]+/', $agent)) {
                    $browser = 'Mozilla Firefox';
                } elseif (preg_match('/Chrome\/[\d.]+/', $agent)) {
                    $browser = 'Google Chrome';
                } elseif (preg_match('/Safari\/[\d.]+/', $agent)) {
                    $browser = 'Apple Safari';
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
                    'id' => $session->id,
                    'isCurrent' => $session->id === $request->session()->getId(),
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                    'browser' => $browser,
                    'os' => $os,
                    'type' => $type,
                ];
            });

        return response()->json($sessions);
    }

    public function logoutOtherDevices(Request $request)
    {
        DB::table('sessions')
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        // Optional: clear access tokens as well
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Other devices logged out successfully.']);
    }

    public function logoutSpecificDevice(Request $request, $id)
    {
        DB::table('sessions')
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Device session revoked successfully.']);
    }
}
