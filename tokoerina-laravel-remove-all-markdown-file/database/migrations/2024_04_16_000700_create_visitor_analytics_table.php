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
        Schema::create('visitor_analytics', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->date('visit_date')->notNull();
            $table->string('visitor_ip', 45)->nullable();
            $table->string('visitor_city', 255)->nullable();
            $table->string('visitor_province', 255)->nullable();
            $table->string('visitor_country', 100)->default('Indonesia');
            $table->timestamp('created_at')->useCurrent();

            $table->index('visit_date');
            $table->index('visitor_city');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_analytics');
    }
};
