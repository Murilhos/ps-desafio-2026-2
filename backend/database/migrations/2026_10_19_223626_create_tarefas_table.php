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
        Schema::create('tarefas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('projeto_id')->constrained('projetos')->onDelete('cascade');
            $table->foreignUuid('membro_id')->constrained('membros')->onDelete('restrict'); // RN04 Garante que não seja possível deletar um membro que esteja associado a uma tarefa
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->enum('status', ['pendente', 'em_andamento', 'concluída'])->default('pendente');
            $table->date('prazo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarefas');
    }
};
