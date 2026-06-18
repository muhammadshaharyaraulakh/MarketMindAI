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
        Schema::create('campaign_platform_metas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('google_campaign_type')->nullable(); 
            $table->json('google_network_settings')->nullable();
            $table->string('meta_special_ad_category')->nullable();
            $table->decimal('meta_campaign_spend_cap', 15, 2)->nullable();
            $table->json('snap_measurement_spec')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_platform_metas');
    }
};
