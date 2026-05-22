<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $imageUrl = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop';

        $testimonials = [
            [
                'customer_name' => 'Siti Nurhaliza',
                'customer_location' => 'Jakarta',
                'rating' => 5,
                'review_text' => 'Produk Mealjun sangat lezat dan berkualitas! Browniesnya moist dan tidak terlalu manis. Sudah pesan berkali-kali dan selalu puas. Recommended banget!',
                'customer_avatar' => $imageUrl,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Budi Santoso',
                'customer_location' => 'Bandung',
                'rating' => 5,
                'review_text' => 'Cheesecakenya enak banget! Topping strawberrynya segar dan creamy. Packaging juga rapi. Bakal pesan lagi!',
                'customer_avatar' => $imageUrl,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Rina Wijaya',
                'customer_location' => 'Surabaya',
                'rating' => 4,
                'review_text' => 'Cupcakenya cantik dan enak. Frosting sempurna, tidak terlalu tebal. Harga juga terjangkau. Suka!',
                'customer_avatar' => $imageUrl,
                'is_featured' => true,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Ahmad Wijaya',
                'customer_location' => 'Medan',
                'rating' => 5,
                'review_text' => 'Red Velvet cakenya indah dan rasanya mantap! Cocok untuk hadiah ultah. Seller responsif dan pengiriman cepat.',
                'customer_avatar' => $imageUrl,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Dewi Putri',
                'customer_location' => 'Yogyakarta',
                'rating' => 5,
                'review_text' => 'Matcha cake-nya unik dan lezat! Rasa matcha kuat tapi tidak alot. Pas untuk orang yang suka matcha seperti saya.',
                'customer_avatar' => $imageUrl,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Roni Saputra',
                'customer_location' => 'Palembang',
                'rating' => 4,
                'review_text' => 'Donat cookies & creamnya empuk dan rasanya enak. Filling-nya melimpah. Mantap!',
                'customer_avatar' => $imageUrl,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Nurul Aini',
                'customer_location' => 'Makassar',
                'rating' => 5,
                'review_text' => 'Tiramisu cakenya like in Italia! Textur sempurna dan rasa autentik. Sudah lama nyari tiramisu sejati, akhirnya ketemu!',
                'customer_avatar' => $imageUrl,
                'is_featured' => false,
                'is_approved' => true,
            ],
            [
                'customer_name' => 'Hendra Gunawan',
                'customer_location' => 'Semarang',
                'rating' => 4,
                'review_text' => 'Carrot cakenya sehat dan enak. Frosting cream cheesenya mantap. Cocok untuk yang mau cake sehat.',
                'customer_avatar' => $imageUrl,
                'is_featured' => false,
                'is_approved' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create(array_merge($testimonial, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
