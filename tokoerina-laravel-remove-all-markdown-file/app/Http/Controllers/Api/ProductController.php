<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Services\CloudinaryService;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProductController
{
    use PaginationHelper;

    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * List all available products (public)
     */
    public function publicIndex(Request $request)
    {
        $limit = $request->integer('limit', 12);
        $query = Product::whereIn('stock_status', ['available', 'limited']);

        if ($request->has('flavor') || $request->has('category')) {
            $query->where('flavor', $request->input('flavor', $request->input('category')));
        }

        // Apply search if value parameter is provided
        $query = $this->applySearch($query, $request, ['name', 'flavor', 'description']);

        // Apply ordering if provided, otherwise default
        if ($request->has('order') && $request->has('sort')) {
            $query = $this->applyOrdering($query, $request);
        } else {
            $query = $query->orderByDesc('is_featured')->orderByDesc('created_at');
        }

        $products = $query->paginate($limit);

        return response()->json($this->formatPagination($products));
    }

    /**
     * Get single product by ID (public)
     */
    public function publicShow(string $id)
    {
        $product = Product::findOrFail($id);
        $product->increment('view_count');

        return response()->json($this->formatResource($product));
    }

    /**
     * List all products (admin)
     */
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 15);
        $query = Product::with('creator');

        if ($request->has('stock_status')) {
            $query->where('stock_status', $request->input('stock_status'));
        }

        // Apply search if value parameter is provided
        $query = $this->applySearch($query, $request, ['name', 'flavor', 'description']);

        // Apply ordering if provided, otherwise default
        if ($request->has('order') && $request->has('sort')) {
            $query = $this->applyOrdering($query, $request);
        } else {
            $query = $query->orderByDesc('created_at');
        }

        $products = $query->paginate($limit);

        return response()->json($this->formatPagination($products));
    }

    /**
     * Create new product (admin)
     */
    public function store(Request $request)
    {
        $this->normalizePriceInput($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'flavor' => 'required_without:category|string|max:100',
            'category' => 'required_without:flavor|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'required_without:image_url|nullable|image|mimes:jpeg,png,webp,gif|max:5120',
            'image_url' => 'required_without:image|nullable|string|url',
            'shopee_link' => 'nullable|url',
            'tiktok_link' => 'nullable|url',
            'whatsapp_link' => 'nullable|url',
            'stock_status' => 'required|in:available,limited,out_of_stock',
            'is_featured' => 'boolean',
        ]);

        $imageUrl = $validated['image_url'] ?? null;

        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinary->uploadFile(
                $request->file('image'),
                'mealjun/products'
            );
            $imageUrl = $uploadResult['url'];
        }

        $product = Product::create([
            'name' => $validated['name'],
            'flavor' => $validated['flavor'] ?? $validated['category'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'image_url' => $imageUrl,
            'shopee_link' => $validated['shopee_link'] ?? null,
            'tiktok_link' => $validated['tiktok_link'] ?? null,
            'whatsapp_link' => $validated['whatsapp_link'] ?? null,
            'stock_status' => $validated['stock_status'],
            'is_featured' => $validated['is_featured'] ?? false,
            'created_by' => auth()->id(),
        ]);

        return response()->json($this->formatResource($product), 201);
    }

    /**
     * Get single product (admin)
     */
    public function show(string $id)
    {
        $product = Product::with('creator')->findOrFail($id);
        return response()->json($this->formatResource($product));
    }

    /**
     * Update product (admin)
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $this->normalizePriceInput($request);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'flavor' => 'sometimes|string|max:100',
            'category' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,webp,gif|max:5120',
            'image_url' => 'nullable|string|url',
            'shopee_link' => 'nullable|url',
            'tiktok_link' => 'nullable|url',
            'whatsapp_link' => 'nullable|url',
            'stock_status' => 'sometimes|in:available,limited,out_of_stock',
            'is_featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $uploadResult = $this->cloudinary->uploadFile(
                $request->file('image'),
                'mealjun/products'
            );
            $validated['image_url'] = $uploadResult['url'];
        }

        // Remove image key if it exists since it's not a database column
        unset($validated['image']);

        if (isset($validated['category']) && !isset($validated['flavor'])) {
            $validated['flavor'] = $validated['category'];
        }

        unset($validated['category']);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Delete product (admin)
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }

    /**
     * Toggle featured status (admin)
     */
    public function toggleFeatured(string $id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_featured' => !$product->is_featured]);

        return response()->json($product);
    }

    /**
     * Update stock status (admin)
     */
    public function updateStockStatus(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'stock_status' => 'required|in:available,limited,out_of_stock',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function handleMethodOverride(Request $request, string $id)
    {
        return match (strtoupper($request->input('_method', ''))) {
            'PUT', 'PATCH' => $this->update($request, $id),
            'DELETE' => $this->destroy($id),
            default => response()->json(['message' => 'Method tidak didukung'], 405),
        };
    }

    public function handleToggleFeaturedOverride(Request $request, string $id)
    {
        if (strtoupper($request->input('_method', 'PATCH')) !== 'PATCH') {
            return response()->json(['message' => 'Method tidak didukung'], 405);
        }

        return $this->toggleFeatured($id);
    }

    public function handleStockStatusOverride(Request $request, string $id)
    {
        if (strtoupper($request->input('_method', 'PATCH')) !== 'PATCH') {
            return response()->json(['message' => 'Method tidak didukung'], 405);
        }

        return $this->updateStockStatus($request, $id);
    }

    private function normalizePriceInput(Request $request): void
    {
        if (!$request->has('price')) {
            return;
        }

        $request->merge([
            'price' => preg_replace('/[^\d]/', '', (string) $request->input('price')),
        ]);
    }
}
