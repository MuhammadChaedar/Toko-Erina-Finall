<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Traits\PaginationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController
{
    use PaginationHelper;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'required|string',
            'note' => 'nullable|string',
            'subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable|string|max:36',
            'items.*.product_id' => 'nullable|string|max:36',
            'items.*.name' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $order = Order::create([
                'order_code' => $this->generateOrderCode(),
                'customer_name' => $validated['customer_name'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'note' => $validated['note'] ?? null,
                'subtotal' => $validated['subtotal'],
                'shipping_fee' => $validated['shipping_fee'],
                'total' => $validated['total'],
                'status' => Order::DEFAULT_STATUS,
            ]);

            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'product_id' => $item['product_id'] ?? $item['id'] ?? null,
                    'product_name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'total_price' => $item['price'] * $item['quantity'],
                ]);
            }

            return $order->load('items');
        });

        return response()->json([
            'data' => [
                'id' => $order->order_code,
                'order_code' => $order->order_code,
            ],
        ], 201);
    }

    public function index(Request $request)
    {
        $limit = $request->integer('limit', 20);
        $orders = Order::with('items')
            ->orderByDesc('created_at')
            ->paginate($limit);

        $orders->getCollection()->transform(fn (Order $order) => $this->formatOrder($order));

        return response()->json($this->formatPagination($orders));
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:100',
        ]);

        $order = Order::where('id', $id)
            ->orWhere('order_code', $id)
            ->firstOrFail();

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui',
            'data' => $this->formatOrder($order->fresh('items')),
        ]);
    }

    public function handleStatusOverride(Request $request, string $id)
    {
        if (strtoupper($request->input('_method', 'PATCH')) !== 'PATCH') {
            return response()->json(['message' => 'Method tidak didukung'], 405);
        }

        return $this->updateStatus($request, $id);
    }

    private function generateOrderCode(): string
    {
        do {
            $code = 'MLJ-' . random_int(10000000, 99999999);
        } while (Order::where('order_code', $code)->exists());

        return $code;
    }

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->order_code,
            'order_id' => $order->id,
            'order_code' => $order->order_code,
            'customer_name' => $order->customer_name,
            'phone' => $order->phone,
            'address' => $order->address,
            'note' => $order->note,
            'subtotal' => (int) $order->subtotal,
            'shipping_fee' => (int) $order->shipping_fee,
            'total' => (int) $order->total,
            'status' => $order->status,
            'created_at' => $order->created_at?->toISOString(),
            'updated_at' => $order->updated_at?->toISOString(),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'total_price' => (int) $item->total_price,
            ])->values(),
        ];
    }
}
