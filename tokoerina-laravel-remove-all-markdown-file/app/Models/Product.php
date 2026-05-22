<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'flavor',
        'description',
        'price',
        'image_url',
        'shopee_link',
        'tiktok_link',
        'whatsapp_link',
        'stock_status',
        'view_count',
        'is_featured',
        'created_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'view_count' => 'integer',
    ];

    protected $appends = [
        'category',
    ];

    /**
     * Store the price as digits only. Rupiah formatting belongs in the UI.
     */
    public function price(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value,
            set: fn($value) => preg_replace('/[^\d]/', '', (string) $value),
        );
    }

    /**
     * Get the price as numeric value for calculations
     */
    public function getPriceNumericAttribute(): int
    {
        return (int)filter_var($this->price, FILTER_SANITIZE_NUMBER_INT);
    }

    public function getCategoryAttribute(): ?string
    {
        return $this->flavor;
    }

    /**
     * Get the user who created this product.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all visitor analytics for this product.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(VisitorAnalytic::class, 'product_id');
    }

    /**
     * Get all generated captions for this product.
     */
    public function generatedCaptions(): HasMany
    {
        return $this->hasMany(GeneratedCaption::class, 'product_id');
    }
}
