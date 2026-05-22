<?php

namespace App\Http\Controllers\Api;

use App\Models\VisitorAnalytic;
use App\Models\CityStat;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitorAnalyticController
{
    use PaginationHelper;

    /**
     * Track visitor analytics (public)
     */
    public function track(Request $request)
    {
        $validated = $request->validate([
            'visitor_city' => 'nullable|string|max:255',
            'visitor_province' => 'nullable|string|max:255',
            'visitor_country' => 'nullable|string|max:255',
        ]);

        // Create analytics record
        VisitorAnalytic::create([
            'visit_date' => today(),
            'visitor_ip' => $request->ip(),
            'visitor_city' => $validated['visitor_city'],
            'visitor_province' => $validated['visitor_province'],
            'visitor_country' => $validated['visitor_country'],
            'created_at' => now(),
        ]);

        // Update city stats if city is provided
        if ($validated['visitor_city']) {
            $this->updateCityStats($validated['visitor_city'], $validated['visitor_province']);
        }

        return response()->json(['message' => 'Kunjungan berhasil dicatat'], 201);
    }

    /**
     * Get analytics summary (admin)
     */
    public function index(Request $request)
    {
        $days = $request->integer('days', 30);
        $limit = $request->integer('limit', 20);
        $from = now()->subDays($days);

        $totalVisits = VisitorAnalytic::where('created_at', '>=', $from)->count();
        $uniqueCities = VisitorAnalytic::where('created_at', '>=', $from)
            ->select('visitor_city')
            ->distinct()
            ->count();

        $topCountries = VisitorAnalytic::where('created_at', '>=', $from)
            ->select('visitor_country', DB::raw('count(*) as visits'))
            ->groupBy('visitor_country')
            ->orderByDesc('visits')
            ->limit(10)
            ->get();

        $topCities = VisitorAnalytic::where('created_at', '>=', $from)
            ->select('visitor_city', DB::raw('count(*) as visits'))
            ->groupBy('visitor_city')
            ->orderByDesc('visits')
            ->limit(10)
            ->get();

        $dailyVisits = VisitorAnalytic::where('created_at', '>=', $from)
            ->select('visit_date', DB::raw('count(*) as visits'))
            ->groupBy('visit_date')
            ->orderBy('visit_date')
            ->get();

        $visits = VisitorAnalytic::where('created_at', '>=', $from)
            ->orderByDesc('created_at')
            ->paginate($limit);

        return response()->json([
            'data' => $visits->items(),
            'limit' => $visits->perPage(),
            'page' => $visits->currentPage(),
            'size' => count($visits->items()),
            'pages' => $visits->lastPage(),
            'total_visits_period' => $totalVisits,
            'unique_cities' => $uniqueCities,
            'top_countries' => $topCountries,
            'top_cities' => $topCities,
            'daily_visits' => $dailyVisits,
        ]);
    }

    /**
     * Update city statistics
     */
    protected function updateCityStats(string $city, ?string $province): void
    {
        $stat = CityStat::firstOrCreate(
            ['city' => $city],
            ['province' => $province, 'total_visitors' => 0]
        );

        $stat->increment('total_visitors');
        $stat->update(['last_visit_date' => today()]);
    }
}
