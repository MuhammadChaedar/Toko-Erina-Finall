<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasUuids;

    public const DEFAULT_STATUS = 'Menunggu Diproses';
    public const COMPLETED_STATUS = 'Pesanan Selesai';

    protected $fillable = [
        'order_code',
        'customer_name',
        'phone',
        'address',
        'note',
        'subtotal',
        'shipping_fee',
        'total',
        'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
