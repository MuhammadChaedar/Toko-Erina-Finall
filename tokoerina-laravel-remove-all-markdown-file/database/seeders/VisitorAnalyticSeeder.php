<?php

namespace Database\Seeders;

use App\Models\VisitorAnalytic;
use App\Models\Product;
use Illuminate\Database\Seeder;

class VisitorAnalyticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $cities = [
            ['city' => 'Jakarta', 'province' => 'DKI Jakarta'],
            ['city' => 'Bandung', 'province' => 'Jawa Barat'],
            ['city' => 'Surabaya', 'province' => 'Jawa Timur'],
            ['city' => 'Medan', 'province' => 'Sumatera Utara'],
            ['city' => 'Yogyakarta', 'province' => 'Daerah Istimewa Yogyakarta'],
            ['city' => 'Semarang', 'province' => 'Jawa Tengah'],
            ['city' => 'Makassar', 'province' => 'Sulawesi Selatan'],
            ['city' => 'Denpasar', 'province' => 'Bali'],
        ];

        // Generate 200 visitor analytics records
        for ($i = 0; $i < 200; $i++) {
            $city = $cities[array_rand($cities)];

            VisitorAnalytic::create([
                'visit_date' => now()->subDays(rand(0, 30)),
                'visitor_ip' => fake()->ipv4(),
                'visitor_city' => $city['city'],
                'visitor_province' => $city['province'],
                'visitor_country' => 'Indonesia',
                'created_at' => now()->subDays(rand(0, 30)),
            ]);
        }
    }
}
