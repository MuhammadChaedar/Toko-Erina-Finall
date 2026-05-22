<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::whereIn('role', ['admin', 'super_admin'])->first();
        $imageUrl = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop';

        $products = [
            [
                'name' => 'Chocolate Brownies',
                'flavor' => 'Chocolate',
                'description' => 'Brownies cokelat yang lembut dan enak dengan tekstur yang moist. Sempurna untuk kopi pagi atau snack sore hari.',
                'price' => '25000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-brownies',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/brownies',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => true,
            ],
            [
                'name' => 'Strawberry Cheesecake',
                'flavor' => 'Strawberry',
                'description' => 'Cheese cake lembut dengan topping strawberry segar. Rasa creamy dan asam yang seimbang.',
                'price' => '35000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-cheesecake',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/cheesecake',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => true,
            ],
            [
                'name' => 'Vanilla Cupcake',
                'flavor' => 'Vanilla',
                'description' => 'Cupcake vanilla dengan frosting yang lezat. Cocok untuk pesta atau hadiah spesial.',
                'price' => '15000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-cupcake',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/cupcake',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => false,
            ],
            [
                'name' => 'Red Velvet Cake',
                'flavor' => 'Red Velvet',
                'description' => 'Red Velvet cake yang indah dengan cream cheese frosting. Sempurna untuk acara spesial.',
                'price' => '45000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-redvelvet',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/redvelvet',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => true,
            ],
            [
                'name' => 'Matcha Latte Cake',
                'flavor' => 'Matcha',
                'description' => 'Cake matcha dengan rasa yang autentik dan tidak terlalu manis. Cocok untuk penikmat matcha.',
                'price' => '38000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-matcha',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/matcha',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'limited',
                'is_featured' => false,
            ],
            [
                'name' => 'Cookies & Cream Donut',
                'flavor' => 'Cookies & Cream',
                'description' => 'Donat lembut dengan filling cookies & cream. Rasa yang creamy dan enak.',
                'price' => '12000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-donut',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/donut',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => false,
            ],
            [
                'name' => 'Carrot Cake',
                'flavor' => 'Carrot',
                'description' => 'Carrot cake dengan frosting cream cheese yang gurih manis. Sehat dan lezat.',
                'price' => '30000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-carrot',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/carrot',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'available',
                'is_featured' => false,
            ],
            [
                'name' => 'Tiramisu Cake',
                'flavor' => 'Tiramisu',
                'description' => 'Tiramisu authentik dengan cocoa dan mascarpone cheese. Rasanya seperti di Italia.',
                'price' => '40000',
                'shopee_link' => 'https://shopee.co.id/product/mealjun-tiramisu',
                'tiktok_link' => 'https://tiktok.com/@mealjun/video/tiramisu',
                'whatsapp_link' => 'https://wa.me/628123456789',
                'stock_status' => 'out_of_stock',
                'is_featured' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::create(array_merge($product, [
                'image_url' => $imageUrl,
                'view_count' => 0,
                'created_by' => $admin?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
