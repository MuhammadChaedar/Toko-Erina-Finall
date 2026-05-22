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
        Schema::create('generated_captions', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->uuid('product_id')->nullable();
            $table->string('product_name', 255)->nullable();
            $table->string('flavor', 100)->nullable();
            $table->string('tone', 50)->notNull()->comment('friendly, professional, playful');
            $table->boolean('include_emoji')->default(true);
            $table->text('generated_text')->notNull();
            $table->boolean('was_copied')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->uuid('created_by')->nullable();

            $table->foreign('product_id')->references('id')->on('products')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('product_id');
            $table->index('tone');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_captions');
    }
};
