<?php

namespace App\Http\Controllers\Api;

use App\Models\CityStat;
use Illuminate\Http\Request;

class CityStatController
{
    /**
     * Get city statistics (admin)
     */
    public function index()
    {
        $stats = CityStat::orderByDesc('total_visitors')->get();

        return response()->json($stats);
    }
}
