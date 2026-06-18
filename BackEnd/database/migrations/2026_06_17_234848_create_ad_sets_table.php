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
        Schema::create('ad_sets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('platform_adset_id')->nullable()->index();
            $table->string('name');
            $table->enum('status', ['draft', 'active', 'paused', 'archived', 'deleted'])->default('draft');
            $table->foreignId('audience_id')->nullable()->constrained('audiences')->nullOnDelete();
            $table->enum('optimization_goal', ['reach', 'impressions', 'link_clicks', 'landing_page_views', 'conversions', 'app_installs', 'video_views', 'leads']);
            $table->enum('billing_event', ['cpm', 'cpc', 'cpv', 'cpa', 'ocpm']);
            $table->enum('budget_type', ['daily', 'lifetime'])->nullable(); 
            $table->decimal('budget_amount', 15, 2)->nullable();
            $table->decimal('bid_amount', 10, 4)->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('frequency_cap')->nullable();
            $table->enum('frequency_cap_window', ['day', 'week', 'lifetime'])->nullable();
            $table->json('placements')->nullable();
            $table->json('device_targeting')->nullable();
            $table->enum('sync_status', ['pending', 'synced', 'sync_failed'])->default('pending');
            $table->text('platform_error')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_sets');
    }
};
