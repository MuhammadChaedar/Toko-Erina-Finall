<?php

namespace App\Http\Controllers\Api;

use App\Models\StoreLocation;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;

class StoreLocationController
{
    use PaginationHelper;

    /**
     * List all active store locations (public)
     */
    public function publicIndex(Request $request)
    {
        $query = StoreLocation::where('is_active', true);

        if ($request->has('city')) {
            $query->where('city', 'like', "%{$request->input('city')}%");
        }

        if ($request->has('store_type')) {
            $query->where('store_type', $request->input('store_type'));
        }

        $locations = $query->orderBy('city')->get();

        return response()->json($locations);
    }

    /**
     * List all store locations (admin)
     */
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 20);
        $query = StoreLocation::query();

        // Apply search if value parameter is provided
        $query = $this->applySearch($query, $request, ['store_name', 'city', 'address', 'phone']);

        // Apply ordering if provided, otherwise default
        if ($request->has('order') && $request->has('sort')) {
            $query = $this->applyOrdering($query, $request);
        } else {
            $query = $query->orderByDesc('created_at');
        }

        $locations = $query->paginate($limit);

        return response()->json($this->formatPagination($locations));
    }

    /**
     * Create new store location (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'store_type' => 'required|in:retail,reseller',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'required|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'boolean',
        ]);

        $location = StoreLocation::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return response()->json($this->formatResource($location), 201);
    }

    /**
     * Get single store location (admin)
     */
    public function show(string $id)
    {
        $location = StoreLocation::findOrFail($id);
        return response()->json($this->formatResource($location));
    }

    /**
     * Update store location (admin)
     */
    public function update(Request $request, string $id)
    {
        $location = StoreLocation::findOrFail($id);

        $validated = $request->validate([
            'store_name' => 'sometimes|string|max:255',
            'store_type' => 'sometimes|in:retail,reseller',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'phone' => 'sometimes|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_active' => 'boolean',
        ]);

        $location->update($validated);

        return response()->json($this->formatResource($location));
    }

    /**
     * Delete store location (admin)
     */
    public function destroy(string $id)
    {
        $location = StoreLocation::findOrFail($id);
        $location->delete();

        return response()->json(['message' => 'Lokasi toko berhasil dihapus']);
    }
}
