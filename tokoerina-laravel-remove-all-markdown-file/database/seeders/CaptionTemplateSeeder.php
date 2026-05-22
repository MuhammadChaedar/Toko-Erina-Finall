<?php

namespace Database\Seeders;

use App\Models\CaptionTemplate;
use Illuminate\Database\Seeder;

class CaptionTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CaptionTemplate::updateOrCreate(
            ['tone' => 'friendly'],
            [
                'template_text' => "😍 Hei teman-teman! Kenalin nih produk favorit kita: _{name}_ rasa {flavor}!\n\nGak bakal nyesel deh nyobain. Harganya cuma {price} aja loh! 🎉\n\n{description}\n\n#Mealjun #Yummy #{flavor}",
                'prompt' => 'Buatkan caption Instagram yang friendly dan casual untuk produk makanan. Gunakan emoji, sebutkan nama produk dan rasanya. Caption harus menarik dan membuat orang ingin mencoba produk ini. Maksimal 3-5 baris.',
                'is_active' => true,
                'updated_at' => now(),
            ]
        );

        CaptionTemplate::updateOrCreate(
            ['tone' => 'professional'],
            [
                'template_text' => "Kami dengan bangga mempersembahkan _{name}_ — varian {flavor} dari Mealjun.\n\nDibuat dengan bahan pilihan berkualitas tinggi.\n\n{description}\n\nHarga: {price}\n\nPesan sekarang melalui tautan di bio.",
                'prompt' => 'Buatkan caption Instagram yang profesional dan formal untuk produk makanan premium. Fokus pada kualitas bahan dan kesuksesan bisnis. Gunakan tone yang sopan namun menarik. Maksimal 3-4 baris.',
                'is_active' => true,
                'updated_at' => now(),
            ]
        );

        CaptionTemplate::updateOrCreate(
            ['tone' => 'playful'],
            [
                'template_text' => "🎊 STOP SCROLLING! 🛑\n\nKamu belum coba {name} rasa {flavor}?!\nKami serius ini wajib masuk bucket list snack kamu! 🤤\n\n{description}\n\nCuman {price} bro! Buruan sebelum kehabisan! 🔥\n\n#Mealjun #MustTry",
                'prompt' => 'Buatkan caption Instagram yang playful dan fun untuk produk makanan. Gunakan bahasa santai, banyak emoji, dan buat orang tertarik untuk membeli. Jangan terlalu formal. Maksimal 3-5 baris.',
                'is_active' => true,
                'updated_at' => now(),
            ]
        );
    }
}
