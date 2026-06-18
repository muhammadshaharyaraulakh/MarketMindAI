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
        Schema::create('ad_snapchat_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('brand_name', 25)->nullable();
            $table->string('headline', 34)->nullable();
            $table->enum('call_to_action', ['swipe_up', 'shop_now', 'watch', 'book_now', 'sign_up'])->nullable();
            $table->string('attachment_url', 2048)->nullable();
            $table->string('pixel_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_snapchat_details');
    }
};
