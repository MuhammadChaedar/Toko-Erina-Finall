<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('caption_templates', function (Blueprint $table) {
            $table->text('prompt')->nullable()->after('template_text')->comment('AI prompt untuk tone ini (untuk generate dengan AI)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('caption_templates', function (Blueprint $table) {
            $table->dropColumn(['prompt']);
        });
    }
};
