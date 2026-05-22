<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'email',
        'password_hash',
        'full_name',
        'role',
        'is_active',
        'last_login',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_login' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get all products created by this user.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'created_by');
    }

    /**
     * Get all gallery images created by this user.
     */
    public function galleryImages(): HasMany
    {
        return $this->hasMany(GalleryImage::class, 'created_by');
    }

    /**
     * Get all generated captions created by this user.
     */
    public function generatedCaptions(): HasMany
    {
        return $this->hasMany(GeneratedCaption::class, 'created_by');
    }
}
