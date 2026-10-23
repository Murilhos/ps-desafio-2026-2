<?php

namespace App\Models;

use App\Models\MembroProjeto;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membro extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'cor_favorita',
        'data_aniversario',
        'image',
    ];

    protected $hidden = [
        'senha',
    ];

    /*Sugestão de casting para os campos, garantindo a formatação. A função casts() é usada para converter os valores 
    dos atributos do modelo para tipos específicos quando eles são acessados. */
    protected function casts(): array
    {
        return [
            'data_aniversario' => 'date:d-m-Y',
            'senha' => 'hashed',
        ];
    }

    public function tarefas()
    {
        return $this->hasMany(Tarefa::class);
    }

    public function projetos()
    {
        return $this->belongsToMany(Projeto::class, 'membro_projeto')->using(MembroProjeto::class)->withTimestamps();//Aqui tive que colocar uma adição para o Eloquet reconhecer a tabela pivot, e então ele passou a funcionar corretamente.
    }

    public function projetosAtivosContador(): int
    {
        return $this->projetos()->where('status', 'ativo')->count();
    }
}

