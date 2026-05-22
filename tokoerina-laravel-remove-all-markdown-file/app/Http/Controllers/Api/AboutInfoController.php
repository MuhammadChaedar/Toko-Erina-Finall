<?php

namespace App\Http\Controllers\Api;

use App\Models\AboutInfo;
use App\Services\CloudinaryService;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;

class AboutInfoController
{
    use PaginationHelper;

    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * Get about info (public)
     */
    public function show()
    {
        $about = AboutInfo::first();

        if (!$about) {
            return response()->json(['message' => 'Data about belum tersedia'], 404);
        }

        return response()->json($this->formatResource($about));
    }

    /**
     * Update about info (admin)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'story' => 'sometimes|nullable|string',
            'vision' => 'sometimes|string',
            'mission' => 'sometimes|string',
            'commitment' => 'sometimes|nullable|string',
            'image_url' => 'sometimes|nullable|string',
            'image_base64' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if ($value && !preg_match('/^data:image\\/(jpeg|png|webp|gif);base64,/', $value)) {
                        $fail('The ' . $attribute . ' must be a valid base64 image (jpeg, png, webp, or gif).');
                    }
                },
            ],
            'whatsapp_number' => 'sometimes|string|max:20',
            'email' => 'sometimes|email',
            'address' => 'sometimes|string',
        ]);

        if (isset($validated['image_base64'])) {
            $uploadResult = $this->cloudinary->uploadBase64(
                $validated['image_base64'],
                'mealjun/about'
            );
            $validated['image_url'] = $uploadResult['url'];
            unset($validated['image_base64']);
        }

        $validated['updated_by'] = auth()->id();
        $validated['updated_at'] = now();

        $about = AboutInfo::first();

        if ($about) {
            $about->update($validated);
        } else {
            // Create with defaults if doesn't exist
            $defaults = [
                'title' => '-',
                'description' => '-',
                'story' => null,
                'vision' => '-',
                'mission' => '-',
                'commitment' => null,
                'image_url' => '',
                'whatsapp_number' => '62',
                'email' => 'info@example.com',
                'address' => '-',
            ];

            $about = AboutInfo::create(array_merge($defaults, $validated));
        }

        return response()->json($this->formatResource($about));
    }
}
