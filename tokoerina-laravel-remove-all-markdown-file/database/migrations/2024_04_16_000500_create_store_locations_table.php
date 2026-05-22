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
        Schema::create('store_locations', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('store_name', 255)->notNull();
            $table->string('store_type', 50)->notNull()->comment('retail, reseller');
            $table->text('address')->notNull();
            $table->string('city', 255)->notNull();
            $table->string('province', 255)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('phone', 20)->notNull();
            $table->decimal('latitude', 10, 8)->nullable()->comment('Koordinat latitude untuk peta');
            $table->decimal('longitude', 11, 8)->nullable()->comment('Koordinat longitude untuk peta');
            $table->boolean('is_active')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->char('created_by', 36)->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->index('city');
            $table->index('store_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_locations');
    }
};
