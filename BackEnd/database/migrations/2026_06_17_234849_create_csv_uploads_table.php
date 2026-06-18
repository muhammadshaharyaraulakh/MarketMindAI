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
        Schema::create('csv_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ad_account_id')->nullable()->constrained()->nullOnDelete();
            $table->string('original_filename');
            $table->string('stored_path');
            $table->enum('platform', ['google', 'meta', 'snapchat', 'custom']);
            $table->enum('target_level', ['campaign', 'ad_set', 'ad', 'analytics_only']);
            $table->json('column_mapping')->nullable();
            $table->unsignedInteger('row_count')->nullable();
            $table->unsignedInteger('rows_processed')->default(0);
            $table->unsignedInteger('rows_failed')->default(0);
            $table->enum('status', ['pending', 'mapping', 'processing', 'ready', 'failed'])->default('pending');
            $table->text('error_log')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csv_uploads');
    }
};
