<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->text('image_url')->notNull();
            $table->text('caption')->notNull();
            $table->integer('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->char('created_by', 36)->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('display_order');
            $table->index('is_published');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
