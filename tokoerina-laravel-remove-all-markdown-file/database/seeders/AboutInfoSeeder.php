<?php

namespace Database\Seeders;

use App\Models\AboutInfo;
use App\Models\User;
use Illuminate\Database\Seeder;

class AboutInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::whereIn('role', ['admin', 'super_admin'])->first();
        $imageUrl = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop';

        AboutInfo::create([
            'title' => 'Tentang Mealjun',
            'description' => 'Mealjun adalah toko kue online terpercaya yang menyediakan berbagai jenis kue, brownies, dan pastry berkualitas tinggi. Kami berkomitmen menggunakan bahan-bahan pilihan terbaik dan resep autentik untuk menciptakan produk yang lezat dan memuaskan. Sejak didirikan pada tahun 2020, kami telah melayani ribuan pelanggan setia di seluruh Indonesia dengan dedikasi penuh.',
            'story' => 'Toko Erina hadir untuk membantu pelanggan mendapatkan kebutuhan harian dengan mudah dan terpercaya.',
            'vision' => 'Menjadi pilihan utama untuk produk kue dan pastry berkualitas tinggi di seluruh Indonesia, dengan standar rasa dan kualitas yang konsisten.',
            'mission' => 'Memberikan produk kue terbaik dengan harga terjangkau, menggunakan bahan berkualitas tinggi, dan memberikan pelayanan terbaik kepada setiap pelanggan setia kami.',
            'commitment' => 'Kami berkomitmen menjaga kualitas produk, pelayanan cepat, dan komunikasi yang responsif.',
            'image_url' => $imageUrl,
            'whatsapp_number' => '6285724559308',
            'email' => 'info@mealjun.com',
            'address' => 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 12190',
            'updated_by' => $admin?->id,
            'updated_at' => now(),
        ]);
    }
}
