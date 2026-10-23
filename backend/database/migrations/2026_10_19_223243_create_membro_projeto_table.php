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
        Schema::create('membro_projeto', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('projeto_id')->constrained('projetos')->onDelete('cascade');
            $table->foreignUuid('membro_id')->constrained('membros')->onDelete('cascade');
            $table->unique(['projeto_id', 'membro_id']); // RN07 Garante que não haja duplicatas de projeto e membro, tive que pergutnar pra IA como eu faço isso
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membro_projeto');
    }
};
    