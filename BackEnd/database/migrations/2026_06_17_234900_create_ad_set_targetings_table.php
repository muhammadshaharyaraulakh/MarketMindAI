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
        Schema::create('ad_set_targeting', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_set_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('age_min')->default(18);
            $table->unsignedTinyInteger('age_max')->default(65);
            $table->json('genders')->nullable();
            $table->json('locations')->nullable();
            $table->json('languages')->nullable();
            $table->json('interests')->nullable();
            $table->json('keywords')->nullable();
            $table->json('negative_keywords')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_set_targetings');
    }
};
