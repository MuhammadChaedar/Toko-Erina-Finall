<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CityStat extends Model
{
    use HasUuids;

    protected $table = 'city_stats';
    public $timestamps = false;

    protected $fillable = [
        'city',
        'province',
        'total_visitors',
        'total_stores',
        'last_visit_date',
    ];

    protected $casts = [
        'total_visitors' => 'integer',
        'total_stores' => 'integer',
        'last_visit_date' => 'date',
    ];
}
