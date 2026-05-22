<?php

namespace Database\Seeders;

use App\Models\StoreLocation;
use App\Models\User;
use Illuminate\Database\Seeder;

class StoreLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::whereIn('role', ['admin', 'super_admin'])->first();

        $locations = [
            [
                'store_name' => 'Mealjun Jakarta Pusat',
                'store_type' => 'retail',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'postal_code' => '12190',
                'phone' => '+62212345678',
                'latitude' => -6.2087,
                'longitude' => 106.8152,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Jakarta Selatan',
                'store_type' => 'retail',
                'address' => 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'postal_code' => '12930',
                'phone' => '+62217654321',
                'latitude' => -6.2257,
                'longitude' => 106.8015,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Bandung',
                'store_type' => 'retail',
                'address' => 'Jl. Diponegoro No. 789, Bandung',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'postal_code' => '40132',
                'phone' => '+6224567890',
                'latitude' => -6.9175,
                'longitude' => 107.6062,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Surabaya',
                'store_type' => 'retail',
                'address' => 'Jl. Ahmad Yani No. 321, Surabaya',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'postal_code' => '60188',
                'phone' => '+623187654321',
                'latitude' => -7.2504,
                'longitude' => 112.7508,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Medan',
                'store_type' => 'reseller',
                'address' => 'Jl. Imam Bonjol No. 654, Medan',
                'city' => 'Medan',
                'province' => 'Sumatera Utara',
                'postal_code' => '20122',
                'phone' => '+62612345678',
                'latitude' => 3.5952,
                'longitude' => 98.6722,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Yogyakarta',
                'store_type' => 'retail',
                'address' => 'Jl. Malioboro No. 111, Yogyakarta',
                'city' => 'Yogyakarta',
                'province' => 'Daerah Istimewa Yogyakarta',
                'postal_code' => '55271',
                'phone' => '+62274567890',
                'latitude' => -7.7979,
                'longitude' => 110.3695,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Makassar',
                'store_type' => 'reseller',
                'address' => 'Jl. Jendral Sudirman No. 999, Makassar',
                'city' => 'Makassar',
                'province' => 'Sulawesi Selatan',
                'postal_code' => '90231',
                'phone' => '+62411234567',
                'latitude' => -5.1364,
                'longitude' => 119.4325,
                'is_active' => true,
            ],
            [
                'store_name' => 'Mealjun Bali',
                'store_type' => 'retail',
                'address' => 'Jl. Legian No. 500, Denpasar',
                'city' => 'Denpasar',
                'province' => 'Bali',
                'postal_code' => '80361',
                'phone' => '+62361234567',
                'latitude' => -8.6705,
                'longitude' => 115.2126,
                'is_active' => true,
            ],
        ];

        foreach ($locations as $location) {
            StoreLocation::create(array_merge($location, [
                'created_by' => $admin?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
