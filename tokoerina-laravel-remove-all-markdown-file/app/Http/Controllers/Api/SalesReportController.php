<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class SalesReportController
{
    public function monthly(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $report = $this->buildReport($validated['month']);

        return response()->json($report);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $report = $this->buildReport($validated['month']);
        $content = $this->buildExcelXml($report);
        $filename = 'sales-report-' . $validated['month'] . '.xls';

        return response($content, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'max-age=0, no-cache, no-store, must-revalidate',
        ]);
    }

    private function buildReport(string $month): array
    {
        [$start, $end] = $this->monthRange($month);

        $orders = Order::with('items')
            ->where('created_at', '>=', $start)
            ->where('created_at', '<', $end)
            ->orderByDesc('created_at')
            ->get();

        $products = $orders
            ->flatMap(fn (Order $order) => $order->items)
            ->groupBy('product_name')
            ->map(fn (Collection $items, string $name) => [
                'name' => $name,
                'quantity' => (int) $items->sum('quantity'),
                'revenue' => (int) $items->sum('total_price'),
            ])
            ->sortByDesc('revenue')
            ->values();

        $totalOrders = $orders->count();
        $totalRevenue = (int) $orders->sum('total');

        return [
            'month' => $month,
            'summary' => [
                'total_orders' => $totalOrders,
                'completed_orders' => $orders->where('status', Order::COMPLETED_STATUS)->count(),
                'items_sold' => (int) $orders->flatMap(fn (Order $order) => $order->items)->sum('quantity'),
                'total_revenue' => $totalRevenue,
                'average_order_value' => $totalOrders > 0 ? (int) round($totalRevenue / $totalOrders) : 0,
            ],
            'orders' => $orders->map(fn (Order $order) => [
                'id' => $order->order_code,
                'order_id' => $order->id,
                'customer_name' => $order->customer_name,
                'phone' => $order->phone,
                'status' => $order->status,
                'subtotal' => (int) $order->subtotal,
                'shipping_fee' => (int) $order->shipping_fee,
                'total' => (int) $order->total,
                'created_at' => $order->created_at?->toISOString(),
            ])->values(),
            'products' => $products,
        ];
    }

    private function monthRange(string $month): array
    {
        $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();

        return [$start, $start->copy()->addMonth()];
    }

    private function buildExcelXml(array $report): string
    {
        $summaryRows = [
            ['Metric', 'Value'],
            ['Total Orders', $report['summary']['total_orders']],
            ['Completed Orders', $report['summary']['completed_orders']],
            ['Items Sold', $report['summary']['items_sold']],
            ['Total Revenue', $report['summary']['total_revenue']],
            ['Average Order Value', $report['summary']['average_order_value']],
        ];

        $orderRows = collect($report['orders'])
            ->map(fn (array $order) => [
                $order['id'],
                $order['customer_name'],
                $order['phone'],
                $order['status'],
                $order['subtotal'],
                $order['shipping_fee'],
                $order['total'],
                $order['created_at'],
            ])
            ->prepend(['Order Code', 'Customer Name', 'Phone', 'Status', 'Subtotal', 'Shipping Fee', 'Total', 'Created At'])
            ->all();

        $productRows = collect($report['products'])
            ->map(fn (array $product) => [
                $product['name'],
                $product['quantity'],
                $product['revenue'],
            ])
            ->prepend(['Product Name', 'Quantity', 'Revenue'])
            ->all();

        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<?mso-application progid="Excel.Sheet"?>' . "\n"
            . '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
            . 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
            . $this->worksheet('Ringkasan Bulanan', $summaryRows)
            . $this->worksheet('Daftar Pesanan', $orderRows)
            . $this->worksheet('Inventaris Produk Terjual', $productRows)
            . '</Workbook>';
    }

    private function worksheet(string $name, array $rows): string
    {
        $xmlRows = collect($rows)
            ->map(fn (array $row) => '<Row>' . collect($row)
                ->map(fn ($value) => '<Cell><Data ss:Type="' . $this->excelType($value) . '">'
                    . htmlspecialchars((string) $value, ENT_XML1 | ENT_COMPAT, 'UTF-8')
                    . '</Data></Cell>')
                ->implode('') . '</Row>')
            ->implode('');

        return '<Worksheet ss:Name="' . htmlspecialchars($name, ENT_XML1 | ENT_COMPAT, 'UTF-8') . '"><Table>'
            . $xmlRows
            . '</Table></Worksheet>';
    }

    private function excelType(mixed $value): string
    {
        return is_numeric($value) ? 'Number' : 'String';
    }
}
