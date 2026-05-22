<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\CaptionTemplate;
use App\Models\GeneratedCaption;
use App\Services\NvidiaKimiService;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GeneratedCaptionController
{
    use PaginationHelper;

    public function __construct(protected NvidiaKimiService $kimiService) {}

    /**
     * List generated captions by current user (admin)
     */
    public function index(Request $request)
    {
        $limit = $request->integer('limit', 20);
        $query = GeneratedCaption::where('created_by', $request->user()->id)
            ->with('product');

        // Apply search if value parameter is provided
        $query = $this->applySearch($query, $request, ['product_name', 'generated_text']);

        // Apply ordering if provided, otherwise default
        if ($request->has('order') && $request->has('sort')) {
            $query = $this->applyOrdering($query, $request);
        } else {
            $query = $query->orderByDesc('created_at');
        }

        $captions = $query->paginate($limit);

        return response()->json($this->formatPagination($captions));
    }

    /**
     * Generate caption from template or AI (admin)
     */
    public function generate(Request $request)
    {
        // Set PHP execution time limit untuk AI generation (150 detik)
        // Ini harus lebih besar dari HTTP timeout di NvidiaKimiService (120 detik)
        set_time_limit(150);

        $validated = $request->validate([
            'product_id' => 'required|uuid|exists:products,id',
            'tone' => 'required|in:friendly,professional,playful',
            'include_emoji' => 'boolean',
            'use_ai' => 'boolean',
        ]);

        // Find product
        $product = Product::findOrFail($validated['product_id']);

        // Find template with matching tone and is_active
        $template = CaptionTemplate::where('tone', $validated['tone'])
            ->where('is_active', true)
            ->first();

        if (!$template) {
            throw ValidationException::withMessages([
                'tone' => ['No active template found for this tone.'],
            ]);
        }

        $useAi = $validated['use_ai'] ?? false;
        $generatedText = '';

        if ($useAi) {
            // Generate using AI
            if (!$template->prompt) {
                throw ValidationException::withMessages([
                    'template' => ['Template does not have AI prompt configured.'],
                ]);
            }

            try {
                $generatedText = $this->kimiService->generateCaption(
                    $template->prompt,
                    $product->name,
                    $product->flavor,
                    $product->price,
                    $product->description,
                    $validated['include_emoji'] ?? true
                );
            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    'ai' => ['Failed to generate caption with AI: ' . $e->getMessage()],
                ]);
            }
        } else {
            // Generate using template
            $generatedText = str_replace(
                ['{name}', '{flavor}', '{price}', '{description}'],
                [$product->name, $product->flavor, $product->price, $product->description],
                $template->template_text
            );

            // Remove emoji if not included
            if (!($validated['include_emoji'] ?? true)) {
                $generatedText = preg_replace('/[\x{1F300}-\x{1FAFF}]/u', '', $generatedText);
            }
        }

        // Create GeneratedCaption
        $caption = GeneratedCaption::create([
            'product_id' => $validated['product_id'],
            'product_name' => $product->name,
            'flavor' => $product->flavor,
            'tone' => $validated['tone'],
            'include_emoji' => $validated['include_emoji'] ?? true,
            'generated_text' => $generatedText,
            'was_copied' => false,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($this->formatResource($caption), 201);
    }

    /**
     * Mark caption as copied
     */
    public function markCopied(string $id)
    {
        $caption = GeneratedCaption::findOrFail($id);
        $caption->update(['was_copied' => true]);

        return response()->json($this->formatResource($caption));
    }

    /**
     * Delete caption
     */
    public function destroy(string $id)
    {
        $caption = GeneratedCaption::findOrFail($id);
        $caption->delete();

        return response()->json([
            'message' => 'Caption berhasil dihapus',
        ]);
    }
}
