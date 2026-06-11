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

Route::post('/add-recovery-email', [ProfileController::class, 'addRecoveryEmail'])->middleware('auth:sanctum');
Route::post('/remove-recovery-email', [ProfileController::class, 'removeRecoveryEmail'])->middleware('auth:sanctum');
Route::post('/update-recovery-email', [ProfileController::class, 'updateRecoveryEmail'])->middleware('auth:sanctum');