<?php

namespace App\Http\Controllers\Api;

use App\Models\CaptionTemplate;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;

class CaptionTemplateController
{
    use PaginationHelper;

    /**
     * List all caption templates (admin)
     */
    public function index()
    {
        $templates = CaptionTemplate::orderBy('tone')->get();

        return response()->json(["data" => $templates]);
    }

    /**
     * Create new caption template (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tone' => 'required|in:friendly,professional,playful',
            'template_text' => 'required|string',
            'prompt' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $template = CaptionTemplate::create($validated);

        return response()->json($this->formatResource($template), 201);
    }

    /**
     * Get caption template detail
     */
    public function show(string $id)
    {
        $template = CaptionTemplate::findOrFail($id);

        return response()->json($template);
    }

    /**
     * Update caption template
     */
    public function update(Request $request, string $id)
    {
        $template = CaptionTemplate::findOrFail($id);

        $validated = $request->validate([
            'tone' => 'sometimes|in:friendly,professional,playful',
            'template_text' => 'sometimes|string',
            'prompt' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);

        return response()->json($this->formatResource($template));
    }

    /**
     * Delete caption template
     */
    public function destroy(string $id)
    {
        $template = CaptionTemplate::findOrFail($id);
        $template->delete();

        return response()->json([
            'message' => 'Template berhasil dihapus',
        ]);
    }
}
