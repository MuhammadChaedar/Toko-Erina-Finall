<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'message',
        'is_read',
        'replied_at',
        'reply_message',
        'created_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'replied_at' => 'datetime',
        'created_at' => 'datetime',
    ];
}
