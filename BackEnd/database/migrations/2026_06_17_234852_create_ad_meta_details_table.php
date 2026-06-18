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
        Schema::create('ad_meta_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('primary_text', 500)->nullable();
            $table->string('link_description', 500)->nullable();
            $table->string('page_id')->nullable();
            $table->string('instagram_actor_id')->nullable();
            $table->string('pixel_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_meta_details');
    }
};
