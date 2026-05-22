<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CaptionTemplate extends Model
{
    use HasUuids;

    protected $fillable = [
        'tone',
        'template_text',
        'prompt',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
