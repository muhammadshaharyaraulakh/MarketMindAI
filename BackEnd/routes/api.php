<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'login']);
Route::post('/two-factor-challenge', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'twoFactorChallenge']);
Route::post('/forgot-password', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'resetPassword'])->name('password.update');
Route::get('/email/verify-custom/{id}/{hash}', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('api.verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [\App\Http\Controllers\Api\Authentication\AuthController::class, 'logout']);
    
    // Profile Session Management
    Route::get('/user/sessions', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'getSessions']);
    Route::delete('/user/sessions', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'logoutOtherDevices'])->middleware('password.confirm');
    Route::delete('/user/sessions/{id}', [\App\Http\Controllers\Api\Profile\ProfileController::class, 'logoutSpecificDevice']);
});