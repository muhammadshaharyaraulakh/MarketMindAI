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
        Schema::create('content_generations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            // plain integer, NO foreign key constraint

            // Step 1 — uploaded image
            $table->string('image_path')->nullable();
            // stored in storage/app/local/content_generation/
            // relative path only, never a public URL

            // Step 2 — AI image analysis result
            $table->json('ai_analysis');
            // { product_name, category, quality_level, vibe[],
            //   colors[], likely_audience }

            // Step 3 — platform selected
            $table->enum('platform', ['google', 'meta', 'snapchat']);

            // Step 4 — user's question answers
            $table->json('question_answers');
            // all 8 answers for the selected platform

            // Step 5 — generated copy output
            $table->json('generated_copy');
            // full platform-specific copy package

            // Auto-expiry
            $table->timestamp('expires_at');
            // always now() + 24 hours

            $table->timestamps();
            // NO softDeletes — hard delete via scheduler
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_generations');
    }
};
