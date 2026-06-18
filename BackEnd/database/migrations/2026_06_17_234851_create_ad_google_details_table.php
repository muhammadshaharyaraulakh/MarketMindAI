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
        Schema::create('ad_google_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->unique()->constrained()->cascadeOnDelete();
            $table->json('headlines')->nullable();
            $table->json('descriptions')->nullable();
            $table->string('path1', 15)->nullable();
            $table->string('path2', 15)->nullable();
            $table->string('business_name', 25)->nullable();
            $table->json('final_urls')->nullable();
            $table->json('sitelink_extensions')->nullable();
            $table->json('callout_extensions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_google_details');
    }
};
