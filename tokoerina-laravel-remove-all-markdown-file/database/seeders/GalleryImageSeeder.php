<?php

namespace Database\Seeders;

use App\Models\GalleryImage;
use App\Models\User;
use Illuminate\Database\Seeder;

class GalleryImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::whereIn('role', ['admin', 'super_admin'])->first();
        $imageUrl = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop';

        $galleries = [
            [
                'caption' => 'Chocolate Brownies Fresh from Oven',
                'display_order' => 0,
                'is_published' => true,
            ],
            [
                'caption' => 'Strawberry Cheesecake with Fresh Berries',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'caption' => 'Red Velvet Cake for Special Occasions',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'caption' => 'Matcha Latte Cake - Perfect Green Tea Flavor',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'caption' => 'Vanilla Cupcakes with Colorful Frosting',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'caption' => 'Cookies & Cream Donuts - Sweet and Creamy',
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'caption' => 'Carrot Cake with Cream Cheese Frosting',
                'display_order' => 6,
                'is_published' => true,
            ],
            [
                'caption' => 'Tiramisu Cake - Italian Style',
                'display_order' => 7,
                'is_published' => true,
            ],
        ];

        foreach ($galleries as $gallery) {
            GalleryImage::create(array_merge($gallery, [
                'image_url' => $imageUrl,
                'created_by' => $admin?->id,
                'created_at' => now(),
            ]));
        }
    }
}
