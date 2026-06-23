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

    // Content Generation Routes
    Route::prefix('content-generation')->group(function () {
        Route::post('/analyze-image', [\App\Http\Controllers\Api\ContentGenerationController::class, 'analyzeImage']);

        Route::post('/generate', [\App\Http\Controllers\Api\ContentGenerationController::class, 'generate']);
        Route::post('/save', [\App\Http\Controllers\Api\ContentGenerationController::class, 'save']);
        Route::get('/library', [\App\Http\Controllers\Api\ContentGenerationController::class, 'library']);
        Route::delete('/library/{id}', [\App\Http\Controllers\Api\ContentGenerationController::class, 'destroy']);
    });

    // Data Ingestion Routes
    Route::prefix('data-ingestion')->group(function () {
        Route::post('/upload', [\App\Http\Controllers\Api\DataIngestionController::class, 'upload']);
        Route::get('/completed-campaigns', [\App\Http\Controllers\Api\DataIngestionController::class, 'completedCampaigns']);
        Route::get('/campaign-context/{id}', [\App\Http\Controllers\Api\DataIngestionController::class, 'campaignContext']);
        Route::get('/upload-history', [\App\Http\Controllers\Api\DataIngestionController::class, 'uploadHistory']);
    });

    // Reports Routes
    Route::prefix('reports')->group(function () {
        Route::get('/campaigns', [\App\Http\Controllers\Api\ReportController::class, 'campaigns']);
        Route::post('/generate', [\App\Http\Controllers\Api\ReportController::class, 'generate']);
        Route::get('/status/{reportId}', [\App\Http\Controllers\Api\ReportController::class, 'status']);
        Route::get('/download/{reportId}', [\App\Http\Controllers\Api\ReportController::class, 'download']);
        Route::get('/history', [\App\Http\Controllers\Api\ReportController::class, 'history']);
    });

    // Overview Routes
    Route::get('/overview/dashboard', [\App\Http\Controllers\Api\OverviewController::class, 'dashboard']);

    // Campaign Management Routes
    Route::prefix('campaigns')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'toggleStatus']);
        
        Route::get('/{id}/daily-logs', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'getDailyLogs']);
        Route::post('/{id}/daily-logs', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'recordDailyLog']);
        Route::put('/{id}/daily-logs/{logId}', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'updateDailyLog']);
        Route::delete('/{id}/daily-logs/{logId}', [\App\Http\Controllers\Api\CampaignManagement\CampaignController::class, 'deleteDailyLog']);

        Route::get('/{campaignId}/adsets', [\App\Http\Controllers\Api\CampaignManagement\AdSetController::class, 'index']);
    });

    Route::prefix('adsets')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\CampaignManagement\AdSetController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\CampaignManagement\AdSetController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\CampaignManagement\AdSetController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\CampaignManagement\AdSetController::class, 'toggleStatus']);
        
        Route::get('/{adSetId}/ads', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'index']);
    });

    Route::prefix('ads')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'toggleStatus']);
        Route::post('/{id}/resubmit', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'resubmit']);
        Route::post('/{id}/metrics', [\App\Http\Controllers\Api\CampaignManagement\AdController::class, 'recordMetrics']);
    });

    // Insights & Alerts
    Route::prefix('insights')->group(function () {
        Route::get('/alerts', [\App\Http\Controllers\Api\InsightsController::class, 'index']);
        Route::post('/refresh', [\App\Http\Controllers\Api\InsightsController::class, 'refresh']);
        Route::patch('/alerts/{id}/dismiss', [\App\Http\Controllers\Api\InsightsController::class, 'dismiss']);
        Route::patch('/recommendations/{id}/apply', [\App\Http\Controllers\Api\InsightsController::class, 'applyRecommendation']);
        Route::patch('/recommendations/{id}/dismiss', [\App\Http\Controllers\Api\InsightsController::class, 'dismissRecommendation']);
    });

    Route::prefix('chatbot')->group(function () {
        Route::post('/send', [\App\Http\Controllers\Api\ChatbotController::class, 'send']);
        Route::get('/sessions', [\App\Http\Controllers\Api\ChatbotController::class, 'sessions']);
        Route::get('/sessions/{sessionId}/messages', [\App\Http\Controllers\Api\ChatbotController::class, 'history']);
        Route::delete('/sessions/{sessionId}', [\App\Http\Controllers\Api\ChatbotController::class, 'deleteSession']);
    });

    // Integrations (Ad Accounts)
    Route::prefix('integrations')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\IntegrationController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\IntegrationController::class, 'store']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\IntegrationController::class, 'destroy']);
    });
    
    // Stripe Payments
    Route::prefix('stripe')->group(function () {
        Route::post('/payment-intent', [\App\Http\Controllers\Api\StripeController::class, 'createPaymentIntent']);
    });
});

// Stripe Webhook (No auth:sanctum)
Route::post('/stripe/webhook', [\App\Http\Controllers\Api\StripeController::class, 'handleWebhook']);