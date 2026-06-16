<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Backend is running successfully.']);
});

Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\Auth\OAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [\App\Http\Controllers\Auth\OAuthController::class, 'callback']);
