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
        Schema::create('products', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name', 255)->notNull();
            $table->string('flavor', 100)->notNull();
            $table->text('description')->notNull();
            $table->string('price', 50)->notNull()->comment('Format: Rp 15.000');
            $table->text('image_url')->notNull();
            $table->text('shopee_link')->nullable();
            $table->text('tiktok_link')->nullable();
            $table->text('whatsapp_link')->nullable();
            $table->string('stock_status', 50)->default('available')
                ->comment('available, limited, out_of_stock');
            $table->integer('view_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->char('created_by', 36)->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('stock_status');
            $table->index('is_featured');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
