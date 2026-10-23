<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

/* Eu estava tendo problemas em atribuir membros para os projetos, então pesquisando e perguntando para a IA, descobri que eu precisava criar um modelo
para a tabela pivot, e então eu poderia usar o método attach() para atribuir membros aos projetos. Eu também adicionei a trait HasUuids para gerar automaticamente os IDs como UUIDs.*/
class MembroProjeto extends Pivot
{
    use HasUuids, HasFactory ;

    protected $table = 'membro_projeto';

}
