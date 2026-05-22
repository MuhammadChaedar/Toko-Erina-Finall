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
        Schema::table('about_info', function (Blueprint $table) {
            if (!Schema::hasColumn('about_info', 'story')) {
                $table->text('story')->nullable()->after('description');
            }

            if (!Schema::hasColumn('about_info', 'commitment')) {
                $table->text('commitment')->nullable()->after('mission');
            }
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            if (!Schema::hasColumn('contact_messages', 'email')) {
                $table->string('email', 255)->nullable()->after('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('about_info', function (Blueprint $table) {
            if (Schema::hasColumn('about_info', 'story')) {
                $table->dropColumn('story');
            }

            if (Schema::hasColumn('about_info', 'commitment')) {
                $table->dropColumn('commitment');
            }
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            if (Schema::hasColumn('contact_messages', 'email')) {
                $table->dropColumn('email');
            }
        });
    }
};
