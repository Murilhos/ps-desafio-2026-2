<?php

namespace App\Services;

use App\Models\Membro;
use App\Models\Projeto;
use Illuminate\Support\Facades\DB;
use Exception;

class AlocacaoService
{
    const LIMITE_PROJETOS_ATIVO = 2;

    public function alocar(Projeto $projeto, Membro $membro): void
    {
        DB::transaction(function () use ($projeto, $membro) {

        //Bloqueia o membro para evitar condição de corrida
        $membro = Membro::lockForUpdate()->find($membro->id);

        // Verifica se o membro já está alocado ao projeto
        $jaAlocado = $projeto->membros()->where('membro_id', $membro->id)->exists();

        if ($jaAlocado) {
            throw new Exception('Membro já alocado a este projeto.');
        }
        
        //Verifica o limite de projetos ativos
        if ($projeto->estaAtivo()) {
            $this->validarLimite($membro, $projeto);
        }
        
        // Aloca o membro ao projeto
            $projeto->membros()->attach($membro->id);
        });

    }

    public function desalocar(Projeto $projeto, Membro $membro): void
    {
        // Verifica tarefas pendentes
        $tarefasPendentes = $membro->tarefas()->where('projeto_id', $projeto->id)->whereIn('status', ['pendente', 'em_andamento'])->count();

        if ($tarefasPendentes > 0) {
            throw new Exception("{$membro->nome} tem {$tarefasPendentes} tarefa(s) em aberto neste projeto. Reatribua-as antes de remover o membro.");
        }

        $projeto->membros()->detach($membro->id);
    }

    public function validarAtivacao(Projeto $projeto): void
    {
        //Ao ativar, verifica todos os membros já alocados
        foreach ($projeto->membros as $membro) {
            $this->validarLimite($membro, $projeto);
        }
    }

    private function validarLimite(Membro $membro, Projeto $projeto): void
    {
        $count = $membro->projetos()->where('status', 'ativo')->where('projetos.id', '!=', $projeto->id)->count();

        if ($count >= self::LIMITE_PROJETOS_ATIVO) {
            throw new Exception("{$membro->nome} já está alocado em {$count} projeto(s) ativo(s). Limite de " . self::LIMITE_PROJETOS_ATIVO . " atingido.");
        }
    }
}