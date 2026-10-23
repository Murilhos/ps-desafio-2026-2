<?php

namespace App\Models;

use App\Models\MembroProjeto;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projeto extends Model
{
   use HasFactory,  HasUuids;

    protected $fillable = [
        'nome',
        'nome_cliente',
        'descricao',
        'data_inicio',
        'data_fim',
        'status', //Adicionei o campo 'status' ao array $fillable para que ele possa ser atribuido em massa.
    ];

    public function tarefas()
    {
        return $this->hasMany(Tarefa::class);
    }

    public function membros()
    {
        return $this->belongsToMany(Membro::class, 'membro_projeto')->using(MembroProjeto::class)->withTimestamps(); //Aqui tive que colocar uma adição para o Eloquet reconhecer a tabela pivot, e então ele passou a funcionar corretamente.
    }

    public function estaAtivo(): bool
    {
        return $this->status === 'ativo';
    }
}
