<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/email/verify-custom/{id}/{hash}', [\App\Http\Controllers\ApiVerificationController::class, 'verify'])
    ->middleware(['signed'])
    ->name('api.verification.verify');
