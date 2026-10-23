<?php

namespace Database\Seeders;

use App\Models\Membro;
use App\Models\Projeto;
use App\Models\Tarefa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TarefaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Busca todos os projetos e membros existentes
        $projetosAtivos = Projeto::where('status', 'ativo')->get();
        $membros = Membro::all();

        if ($projetosAtivos->isEmpty() || $membros->isEmpty()) {
            $this->command->warn('Não há projetos ativos ou membros disponíveis para criar tarefas. Rode o Seeder de Projetos e Membros primeiro.');
            return;
        }

        // Para cada projeto ativo, cria tarefas com membros alocados aleatoriamente
        $projetosAtivos->each(function ($projeto) use ($membros) {
            
            // Aloca entre 2 e 4 membros no projeto
            $membrosDoProjeto = $membros->random(rand(2, 4));

            foreach ($membrosDoProjeto as $membro) {
                // Verifica o limite antes de alocar
                $projetosAtivosDoMembro = $membro->projetos()->where('status', 'ativo')->where('projetos.id', '!=', $projeto->id)->count();

                if ($projetosAtivosDoMembro < 2) {
                    $projeto->membros()->syncWithoutDetaching($membro->id);
                }
            }

            // Recarrega os membros alocados no projeto
            $membrosAlocados = $projeto->membros()->get();

            if ($membrosAlocados->isEmpty()) return;

            // Cria tarefas pendentes
            Tarefa::factory()->count(3)->pendente()->create([
                'projeto_id' => $projeto->id,
                'membro_id' => $membrosAlocados->random()->id,
            ]);

            // Cria tarefas em andamento
            Tarefa::factory()->count(2)->emAndamento()->create([
                'projeto_id' => $projeto->id,
                'membro_id' => $membrosAlocados->random()->id,
            ]);

            // Cria tarefas concluídas
            Tarefa::factory()->count(2)->concluida()->create([
                'projeto_id' => $projeto->id,
                'membro_id' => $membrosAlocados->random()->id,
            ]);

            // Cria tarefas atrasadas
            Tarefa::factory()->count(1)->atrasada()->create([
                'projeto_id' => $projeto->id,
                'membro_id' => $membrosAlocados->random()->id,
            ]);
        });

        $this->command->info('Tarefas criadas com sucesso para ' . $projetosAtivos->count() . ' projetos(s) ativos(s).');
    }

}
