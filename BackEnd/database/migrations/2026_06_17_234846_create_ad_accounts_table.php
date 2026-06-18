<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ad_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('platform', ['google', 'meta', 'snapchat']);
            $table->string('account_name');
            $table->string('platform_account_id')->nullable();
            $table->char('currency', 3)->default('USD');
            $table->string('timezone')->default('UTC');
            $table->enum('status', ['active', 'disconnected'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_accounts');
    }
};
