<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{

    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $request->user()->id,
            'avatar' => 'nullable|string',
            'timezone' => 'nullable|string',
            'language' => 'nullable|string',
            'bio' => 'nullable|string',
        ]);

        if (isset($validated['email']) && $validated['email'] !== $request->user()->email) {
            $validated['email_verified_at'] = null;
        }

        $request->user()->update($validated);

        return response()->json($request->user()->fresh());
    }
}
