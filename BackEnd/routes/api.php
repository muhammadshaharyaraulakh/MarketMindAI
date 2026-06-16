<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\ProfileController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/email/verify-custom/{id}/{hash}', [\App\Http\Controllers\ApiVerificationController::class, 'verify'])
    ->middleware(['signed'])
    ->name('api.verification.verify');

Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'show'])->middleware('auth:sanctum');
Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->middleware('auth:sanctum');

Route::get('/user/sessions', [ProfileController::class, 'getSessions'])->middleware('auth:sanctum');
Route::delete('/user/sessions', [ProfileController::class, 'logoutOtherDevices'])->middleware('auth:sanctum');
Route::delete('/user/sessions/{id}', [ProfileController::class, 'logoutSpecificDevice'])->middleware('auth:sanctum');