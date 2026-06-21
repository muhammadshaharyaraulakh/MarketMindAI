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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('campaign_id');
            $table->string('campaign_name');
            $table->enum('platform', ['google', 'meta', 'snapchat']);
            $table->enum('severity', ['critical', 'warning', 'info']);
            $table->enum('alert_type', ['ctr_drop', 'spend_pacing', 'frequency_cap', 'cpa_spike', 'conversion_drop', 'budget_exhaustion']);
            $table->string('title');
            $table->text('detail');
            $table->decimal('metric_before', 15, 4)->nullable();
            $table->decimal('metric_after', 15, 4)->nullable();
            $table->decimal('percent_change', 8, 2)->nullable();
            $table->enum('status', ['active', 'dismissed', 'resolved'])->default('active');
            $table->timestamp('triggered_at');
            $table->timestamps();

            $table->index(['user_id', 'status', 'severity']);
        });

        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('alert_id');
            $table->text('recommendation_text');
            $table->enum('category', ['budget', 'creative', 'audience', 'bidding', 'pacing']);
            $table->boolean('applied')->default(false);
            $table->boolean('dismissed')->default(false);
            $table->boolean('generated_via_ai')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendations');
        Schema::dropIfExists('alerts');
    }
};
