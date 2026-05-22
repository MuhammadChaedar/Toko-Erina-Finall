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
        Schema::create('city_stats', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('city', 255)->unique()->notNull();
            $table->string('province', 255)->nullable();
            $table->integer('total_visitors')->default(0);
            $table->integer('total_stores')->default(0);
            $table->date('last_visit_date')->nullable();

            $table->index('city');
            $table->index('total_visitors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('city_stats');
    }
};
