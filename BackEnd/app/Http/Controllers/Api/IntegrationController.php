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
            'platform_account_id' => 'required|string|max:255',
            'access_token' => 'required|string',
        ]);

        $existing = AdAccount::where('user_id', auth()->id())
            ->where('platform', $request->platform)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'error' => 'You have already connected an account for this platform. Please disconnect it first.'
            ], 422);
        }

        $account = AdAccount::create([
            'user_id' => auth()->id(),
            'platform' => $request->platform,
            'account_name' => $request->platform . ' Connection',
            'platform_account_id' => $request->platform_account_id,
            'access_token' => $request->access_token,
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
