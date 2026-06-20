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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('campaign_id');
            $table->string('campaign_name');
            $table->enum('report_type', ['performance_summary', 'ai_insights', 'campaign_breakdown', 'full_analytics']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->json('completed_sections')->nullable();
            $table->tinyInteger('total_sections')->default(0);
            $table->tinyInteger('progress_percent')->default(0);
            $table->string('pdf_path')->nullable();
            $table->unsignedBigInteger('pdf_size_bytes')->nullable();
            $table->unsignedInteger('generation_time_seconds')->nullable();
            $table->text('error_message')->nullable();
            $table->string('job_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
