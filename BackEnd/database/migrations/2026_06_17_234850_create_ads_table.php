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
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('ad_set_id')->constrained()->cascadeOnDelete();
            $table->string('platform_ad_id')->nullable()->index();
            $table->string('name');
            $table->enum('status', ['draft', 'active', 'paused', 'pending_review', 'approved', 'rejected', 'archived'])->default('draft');
            $table->enum('ad_format', ['image', 'video', 'carousel', 'collection', 'responsive', 'call_only', 'story']);
            $table->string('headline')->nullable();
            $table->text('description')->nullable();
            $table->string('destination_url', 2048)->nullable();
            $table->enum('cta_type', ['shop_now', 'learn_more', 'sign_up', 'download', 'book_now', 'contact_us'])->nullable();
            $table->json('url_custom_parameters')->nullable();
            $table->enum('review_status', ['not_reviewed', 'pending', 'approved', 'rejected'])->default('not_reviewed');
            $table->text('review_feedback')->nullable();
            $table->string('ab_test_group')->nullable();
            $table->enum('sync_status', ['pending', 'synced', 'sync_failed'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
