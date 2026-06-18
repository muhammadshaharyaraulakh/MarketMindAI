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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ad_account_id')->constrained()->cascadeOnDelete();
            $table->enum('platform', ['google', 'meta', 'snapchat']);
            $table->string('platform_campaign_id')->nullable()->index();
            $table->string('name');
            $table->enum('objective', ['awareness', 'traffic', 'leads', 'sales', 'app_installs', 'video_views', 'engagement']);
            $table->enum('status', ['draft', 'active', 'paused', 'archived', 'deleted'])->default('draft');
            $table->enum('budget_type', ['daily', 'lifetime']);
            $table->decimal('budget_amount', 15, 2)->nullable();
            $table->char('currency', 3)->default('USD');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('bid_strategy', ['lowest_cost', 'target_cpa', 'target_roas', 'manual_cpc', 'manual_cpm'])->nullable();
            $table->decimal('bid_amount', 10, 4)->nullable();
            $table->enum('sync_status', ['pending', 'synced', 'sync_failed', 'out_of_sync'])->default('pending');
            $table->timestamp('last_synced_at')->nullable();
            $table->text('platform_error')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
