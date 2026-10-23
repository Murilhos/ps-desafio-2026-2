<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjetoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 6 projetos ativos para ter tarefas
        \App\Models\Projeto::factory()->count(6)->ativo()->create();

        // 4 projetos planejados
        \App\Models\Projeto::factory()->count(4)->planejado()->create();
    }
}
