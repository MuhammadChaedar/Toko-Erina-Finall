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
        Schema::create('about_info', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('title', 255)->notNull();
            $table->text('description')->notNull();
            $table->text('vision')->notNull();
            $table->text('mission')->notNull();
            $table->text('image_url')->notNull();
            $table->string('whatsapp_number', 20)->notNull();
            $table->string('email', 255)->notNull();
            $table->text('address')->notNull();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->char('updated_by', 36)->nullable();

            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_info');
    }
};
