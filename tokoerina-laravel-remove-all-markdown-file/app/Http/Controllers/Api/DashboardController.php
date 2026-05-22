<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Testimonial;
use App\Models\StoreLocation;
use App\Models\ContactMessage;
use App\Models\GeneratedCaption;
use App\Models\VisitorAnalytic;
use Illuminate\Support\Facades\DB;

class DashboardController
{
    /**
     * Get dashboard summary (admin)
     */
    public function index()
    {
        $summary = [
            'total_products' => Product::count(),
            'featured_products' => Product::where('is_featured', true)->count(),
            'out_of_stock_products' => Product::where('stock_status', 'out_of_stock')->count(),
            'total_testimonials' => Testimonial::count(),
            'pending_testimonials' => Testimonial::where('is_approved', false)->count(),
            'total_store_locations' => StoreLocation::where('is_active', true)->count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
            'total_captions_generated' => GeneratedCaption::count(),
        ];

        $recentMessages = ContactMessage::orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'phone_number', 'is_read', 'created_at']);

        $visitorToday = VisitorAnalytic::whereDate('created_at', today())->count();
        $visitorWeek = VisitorAnalytic::where('created_at', '>=', now()->subWeek())->count();

        $topProducts = Product::orderByDesc('view_count')
            ->limit(5)
            ->get(['id', 'name', 'view_count']);

        return response()->json([
            'summary' => $summary,
            'recent_messages' => $recentMessages,
            'visitor_today' => $visitorToday,
            'visitor_week' => $visitorWeek,
            'top_products' => $topProducts,
        ]);
    }
}
