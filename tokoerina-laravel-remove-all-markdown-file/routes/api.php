<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\GalleryImageController;
use App\Http\Controllers\Api\AboutInfoController;
use App\Http\Controllers\Api\StoreLocationController;
use App\Http\Controllers\Api\CityStatController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\VisitorAnalyticController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CaptionTemplateController;
use App\Http\Controllers\Api\GeneratedCaptionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SalesReportController;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

// Configure rate limiters
RateLimiter::for('contact', function ($request) {
    return Limit::perMinute(3)->by($request->ip());
});

RateLimiter::for('analytics', function ($request) {
    return Limit::perMinute(30)->by($request->ip());
});

Route::get('/', function () {
    return ["home" => "true"];
});

// Public auth routes (no middleware required)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// PUBLIC routes - accessible without authentication
Route::prefix('public')->group(function () {
    // Products
    Route::get('/products', [ProductController::class, 'publicIndex']);
    Route::get('/products/{id}', [ProductController::class, 'publicShow']);

    // Testimonials
    Route::get('/testimonials', [TestimonialController::class, 'publicIndex']);

    // Gallery
    Route::get('/gallery', [GalleryImageController::class, 'publicIndex']);

    // About
    Route::get('/about', [AboutInfoController::class, 'show']);

    // Store Locations
    Route::get('/store-locations', [StoreLocationController::class, 'publicIndex']);

    // Contact (throttled)
    Route::post('/contact', [ContactMessageController::class, 'store'])
        ->middleware('throttle:contact');

    // Analytics Tracking (throttled)
    Route::post('/analytics/track', [VisitorAnalyticController::class, 'track'])
        ->middleware('throttle:analytics');
});

// Checkout route - accessible from frontend without admin authentication
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/contact-messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:contact');

// Admin sales inventory/report routes
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/sales-report', [SalesReportController::class, 'monthly']);
    Route::get('/sales-report/export', [SalesReportController::class, 'export']);
    Route::post('/orders/{id}/status', [OrderController::class, 'handleStatusOverride']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
    Route::patch('/contact-messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
    Route::post('/contact-messages/{id}/reply', [ContactMessageController::class, 'reply']);
    Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);
});

// Protected auth routes (requires auth:sanctum middleware)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ADMIN CRUD routes
    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products/{id}', [ProductController::class, 'handleMethodOverride']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::patch('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/{id}/toggle-featured', [ProductController::class, 'handleToggleFeaturedOverride']);
    Route::patch('/products/{id}/toggle-featured', [ProductController::class, 'toggleFeatured']);
    Route::post('/products/{id}/stock-status', [ProductController::class, 'handleStockStatusOverride']);
    Route::patch('/products/{id}/stock-status', [ProductController::class, 'updateStockStatus']);

    // Testimonials
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::patch('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
    Route::patch('/testimonials/{id}/toggle-featured', [TestimonialController::class, 'toggleFeatured']);
    Route::patch('/testimonials/{id}/toggle-approved', [TestimonialController::class, 'toggleApproved']);

    // Gallery
    Route::post('/gallery', [GalleryImageController::class, 'store']);
    Route::get('/gallery', [GalleryImageController::class, 'index']);
    Route::patch('/gallery/reorder', [GalleryImageController::class, 'reorder']);
    Route::get('/gallery/{id}', [GalleryImageController::class, 'show']);
    Route::put('/gallery/{id}', [GalleryImageController::class, 'update']);
    Route::patch('/gallery/{id}', [GalleryImageController::class, 'update']);
    Route::delete('/gallery/{id}', [GalleryImageController::class, 'destroy']);

    // About Info
    Route::post('/about', [AboutInfoController::class, 'update']);
    Route::put('/about', [AboutInfoController::class, 'update']);

    // Store Locations
    Route::post('/store-locations', [StoreLocationController::class, 'store']);
    Route::get('/store-locations', [StoreLocationController::class, 'index']);
    Route::get('/store-locations/{id}', [StoreLocationController::class, 'show']);
    Route::put('/store-locations/{id}', [StoreLocationController::class, 'update']);
    Route::patch('/store-locations/{id}', [StoreLocationController::class, 'update']);
    Route::delete('/store-locations/{id}', [StoreLocationController::class, 'destroy']);

    // Contact Messages (admin only)
    Route::get('/contact-messages', [ContactMessageController::class, 'index']);
    Route::get('/contact-messages/{id}', [ContactMessageController::class, 'show']);
    Route::patch('/contact-messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
    Route::post('/contact-messages/{id}/reply', [ContactMessageController::class, 'reply']);
    Route::post('/contact-messages/{id}', [ContactMessageController::class, 'handleMethodOverride']);
    Route::delete('/contact-messages/{id}', [ContactMessageController::class, 'destroy']);

    // Analytics (admin only)
    Route::get('/analytics', [VisitorAnalyticController::class, 'index']);

    // City Stats Analytics
    Route::get('/analytics/city-stats', [CityStatController::class, 'index']);

    // Dashboard (admin only)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Caption Templates (admin only)
    Route::post('/caption-templates', [CaptionTemplateController::class, 'store']);
    Route::get('/caption-templates', [CaptionTemplateController::class, 'index']);
    Route::get('/caption-templates/{id}', [CaptionTemplateController::class, 'show']);
    Route::put('/caption-templates/{id}', [CaptionTemplateController::class, 'update']);
    Route::patch('/caption-templates/{id}', [CaptionTemplateController::class, 'update']);
    Route::delete('/caption-templates/{id}', [CaptionTemplateController::class, 'destroy']);

    // Generated Captions (admin only)
    Route::get('/generated-captions', [GeneratedCaptionController::class, 'index']);
    Route::post('/generated-captions', [GeneratedCaptionController::class, 'generate']);
    Route::patch('/generated-captions/{id}/copied', [GeneratedCaptionController::class, 'markCopied']);
    Route::delete('/generated-captions/{id}', [GeneratedCaptionController::class, 'destroy']);
});
