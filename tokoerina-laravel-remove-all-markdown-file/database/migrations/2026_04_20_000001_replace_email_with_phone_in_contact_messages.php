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
        Schema::table('contact_messages', function (Blueprint $table) {
            // Drop email column
            $table->dropColumn('email');

            // Add phone_number column after name
            $table->string('phone_number', 20)->after('name');

            // Add index for phone_number
            $table->index('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            // Drop phone_number column
            $table->dropColumn('phone_number');

            // Restore email column
            $table->string('email', 255)->after('name');

            // Restore email index
            $table->index('email');
        });
    }
};
