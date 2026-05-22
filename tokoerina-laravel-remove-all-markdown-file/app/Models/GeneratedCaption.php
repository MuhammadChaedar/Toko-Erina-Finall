<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeneratedCaption extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'product_name',
        'flavor',
        'tone',
        'include_emoji',
        'generated_text',
        'was_copied',
        'created_by',
        'created_at',
    ];

    protected $casts = [
        'include_emoji' => 'boolean',
        'was_copied' => 'boolean',
        'created_at' => 'datetime',
    ];

    /**
     * Get the product associated with this generated caption.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the user who created this caption.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
