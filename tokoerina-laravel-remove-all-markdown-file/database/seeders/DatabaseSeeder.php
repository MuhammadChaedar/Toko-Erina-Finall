<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CaptionTemplateSeeder::class,
            ProductSeeder::class,
            TestimonialSeeder::class,
            GalleryImageSeeder::class,
            StoreLocationSeeder::class,
            AboutInfoSeeder::class,
            ContactMessageSeeder::class,
            VisitorAnalyticSeeder::class,
        ]);
    }
}
