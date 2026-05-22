<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AboutInfo extends Model
{
    use HasUuids;

    protected $table = 'about_info';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'description',
        'story',
        'vision',
        'mission',
        'commitment',
        'image_url',
        'whatsapp_number',
        'email',
        'address',
        'updated_by',
        'updated_at',
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who updated this record.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
