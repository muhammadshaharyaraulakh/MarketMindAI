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
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->json('credentials')->nullable()->after('platform_account_id');
            if (Schema::hasColumn('ad_accounts', 'access_token')) {
                $table->dropColumn('access_token');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_accounts', function (Blueprint $table) {
            $table->dropColumn('credentials');
            $table->text('access_token')->nullable()->after('platform_account_id');
        });
    }
};
