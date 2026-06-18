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
        Schema::create('audiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_account_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['custom', 'lookalike', 'saved', 'retargeting']);
            $table->enum('source_type', ['pixel', 'crm_file', 'manual'])->nullable();
            $table->json('lookalike_spec')->nullable();
            $table->unsignedBigInteger('approximate_count')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audiences');
    }
};
