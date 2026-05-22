<?php

namespace App\Http\Controllers\Api;

use App\Models\GalleryImage;
use App\Services\CloudinaryService;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;

class GalleryImageController
{
    use PaginationHelper;

    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * List all published gallery images (public)
     */
    public function publicIndex()
    {
        $images = GalleryImage::where('is_published', true)
            ->orderBy('display_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(["data" => $images]);
    }

    /**
     * List all gallery images (admin)
     */
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 20);
        $query = GalleryImage::with('creator');

        // Apply search if value parameter is provided
        $query = $this->applySearch($query, $request, ['caption']);

        // Apply ordering if provided, otherwise default
        if ($request->has('order') && $request->has('sort')) {
            $query = $this->applyOrdering($query, $request);
        } else {
            $query = $query->orderBy('display_order');
        }

        $images = $query->paginate($limit);

        return response()->json($this->formatPagination($images));
    }

    /**
     * Create new gallery image (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image_base64' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^data:image\\/(jpeg|png|webp|gif);base64,/', $value)) {
                        $fail('The ' . $attribute . ' must be a valid base64 image (jpeg, png, webp, or gif).');
                    }
                },
            ],
            'caption' => 'required|string|max:255',
            'display_order' => 'integer|min:0',
            'is_published' => 'boolean',
        ]);

        // Upload image
        $uploadResult = $this->cloudinary->uploadBase64(
            $validated['image_base64'],
            'mealjun/gallery'
        );

        $image = GalleryImage::create([
            'image_url' => $uploadResult['url'],
            'caption' => $validated['caption'],
            'display_order' => $validated['display_order'] ?? 0,
            'is_published' => $validated['is_published'] ?? true,
            'created_by' => auth()->id(),
        ]);

        return response()->json($this->formatResource($image), 201);
    }

    /**
     * Get single gallery image (admin)
     */
    public function show(string $id)
    {
        $image = GalleryImage::with('creator')->findOrFail($id);
        return response()->json($this->formatResource($image));
    }

    /**
     * Update gallery image (admin)
     */
    public function update(Request $request, string $id)
    {
        $image = GalleryImage::findOrFail($id);

        $validated = $request->validate([
            'image_base64' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value && !preg_match('/^data:image\\/(jpeg|png|webp|gif);base64,/', $value)) {
                        $fail('The ' . $attribute . ' must be a valid base64 image (jpeg, png, webp, or gif).');
                    }
                },
            ],
            'caption' => 'sometimes|string|max:255',
            'display_order' => 'sometimes|integer|min:0',
            'is_published' => 'boolean',
        ]);

        if (isset($validated['image_base64'])) {
            $uploadResult = $this->cloudinary->uploadBase64(
                $validated['image_base64'],
                'mealjun/gallery'
            );
            $validated['image_url'] = $uploadResult['url'];
            unset($validated['image_base64']);
        }

        $image->update($validated);

        return response()->json($this->formatResource($image));
    }

    /**
     * Delete gallery image (admin)
     */
    public function destroy(string $id)
    {
        $image = GalleryImage::findOrFail($id);
        $image->delete();

        return response()->json(['message' => 'Gambar galeri berhasil dihapus']);
    }

    /**
     * Reorder gallery images (admin)
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|uuid|exists:gallery_images,id',
            'order.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['order'] as $item) {
            GalleryImage::where('id', $item['id'])
                ->update(['display_order' => $item['display_order']]);
        }

        return response()->json(['message' => 'Urutan galeri berhasil diperbarui']);
    }
}
