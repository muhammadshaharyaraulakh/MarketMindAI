<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = auth()->id();
        $accounts = AdAccount::where('user_id', $userId)->get();

        $grouped = [
            'meta' => [],
            'google' => [],
            'snapchat' => []
        ];

        foreach ($accounts as $account) {
            $grouped[$account->platform][] = [
                'id' => $account->id,
                'name' => $account->account_name,
                'platform_account_id' => $account->platform_account_id,
                'status' => $account->status,
                'currency' => $account->currency,
            ];
        }

        $integrations = [
            ['platform' => 'Meta Ads', 'key' => 'meta', 'accounts' => $grouped['meta']],
            ['platform' => 'Google Ads', 'key' => 'google', 'accounts' => $grouped['google']],
            ['platform' => 'Snapchat Ads', 'key' => 'snapchat', 'accounts' => $grouped['snapchat']],
        ];

        return response()->json(['success' => true, 'data' => $integrations]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'platform' => 'required|in:meta,google,snapchat',
            'account_name' => 'required|string|max:255',
        ]);

        $platform = $request->platform;
        $credentials = [];
        $platformAccountId = null;

        if ($platform === 'meta') {
            $request->validate([
                'meta_app_id' => 'required|string',
                'meta_app_secret' => 'required|string',
                'meta_access_token' => 'required|string',
                'meta_ad_account_id' => 'required|string',
            ]);
            $platformAccountId = $request->meta_ad_account_id;
            $credentials = [
                'app_id' => $request->meta_app_id,
                'app_secret' => $request->meta_app_secret,
                'access_token' => $request->meta_access_token,
            ];
        } elseif ($platform === 'snapchat') {
            $request->validate([
                'snapchat_client_id' => 'required|string',
                'snapchat_client_secret' => 'required|string',
                'snapchat_access_token' => 'required|string',
                'snapchat_ad_account_id' => 'required|string',
            ]);
            $platformAccountId = $request->snapchat_ad_account_id;
            $credentials = [
                'client_id' => $request->snapchat_client_id,
                'client_secret' => $request->snapchat_client_secret,
                'access_token' => $request->snapchat_access_token,
            ];
        } elseif ($platform === 'google') {
            $request->validate([
                'google_developer_token' => 'required|string',
            ]);
            $credentials = [
                'developer_token' => $request->google_developer_token,
            ];
        }

        $existing = AdAccount::where('user_id', auth()->id())
            ->where('platform', $platform)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'error' => 'You have already connected an account for this platform. Please disconnect it first.'
            ], 422);
        }

        $account = AdAccount::create([
            'user_id' => auth()->id(),
            'platform' => $platform,
            'account_name' => $request->account_name,
            'platform_account_id' => $platformAccountId,
            'credentials' => $credentials,
            'status' => 'active',
            'currency' => 'USD',
            'timezone' => 'UTC'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Account connected successfully.',
            'data' => $account
        ], 201);
    }

    public function destroy($id): JsonResponse
    {
        $account = AdAccount::where('user_id', auth()->id())->where('id', $id)->first();
        if (!$account) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account disconnected successfully.'
        ]);
    }
}
