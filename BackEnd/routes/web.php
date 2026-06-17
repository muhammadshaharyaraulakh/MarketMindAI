<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['status' => 'Backend is running successfully.']);
});

// OAuth Routes
Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\Api\Authentication\OAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [\App\Http\Controllers\Api\Authentication\OAuthController::class, 'callback']);


