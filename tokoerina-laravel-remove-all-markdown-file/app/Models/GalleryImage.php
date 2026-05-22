<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'image_url',
        'caption',
        'display_order',
        'is_published',
        'created_by',
        'created_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'display_order' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user who created this gallery image.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
