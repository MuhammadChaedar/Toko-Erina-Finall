<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class VisitorAnalytic extends Model
{
    use HasUuids;

    protected $table = 'visitor_analytics';
    public $timestamps = false;

    protected $fillable = [
        'visit_date',
        'visitor_ip',
        'visitor_city',
        'visitor_province',
        'visitor_country',
        'created_at',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'created_at' => 'datetime',
    ];
}
