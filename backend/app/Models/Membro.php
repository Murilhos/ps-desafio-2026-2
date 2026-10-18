<?php

namespace App\Models;

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
}

