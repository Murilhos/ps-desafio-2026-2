<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarefa extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'projeto_id',
        'membro_id',
        'titulo',
        'descricao',
        'status',
        'prazo',
    ];

    protected $casts = [
        'prazo' => 'date',
    ];

    public function projeto()
    {
        return $this->belongsTo(Projeto::class);
    }

    public function membro()
    {
        return $this->belongsTo(Membro::class);
    }

    public function estaAtrasada(): bool
    {
        return $this->status !== 'concluida' && $this->prazo && $this->prazo->isPast();
    }
}
