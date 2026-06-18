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
        Schema::create('ad_analytics', function (Blueprint $table) {
            $table->id();
            $table->enum('entity_type', ['campaign', 'ad_set', 'ad']);
            $table->unsignedBigInteger('entity_id');
            $table->date('date');
            $table->enum('platform', ['google', 'meta', 'snapchat']);
            $table->unsignedBigInteger('impressions')->default(0);
            $table->unsignedBigInteger('clicks')->default(0);
            $table->decimal('spend', 15, 4)->default(0);
            $table->unsignedInteger('conversions')->default(0);
            $table->decimal('conversion_value', 15, 4)->default(0);
            $table->decimal('ctr', 8, 4)->nullable();
            $table->decimal('cpc', 10, 4)->nullable();
            $table->decimal('cpm', 10, 4)->nullable();
            $table->decimal('roas', 10, 4)->nullable();
            $table->timestamps();

            $table->index(['entity_type', 'entity_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_analytics');
    }
};
