<?php

namespace Database\Factories;

use App\Models\Membro;
use App\Models\Projeto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tarefa>
 */
class TarefaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $prazo = fake()->optional(0.8)->dateTimeBetween('now', '+6 months');

        return [
            'projeto_id' => Projeto::factory(),
            'membro_id' => Membro::factory(),
            'titulo' => fake()->sentence(4),
            'descricao' => fake()->optional(0.7)->paragraph(),
            'status' => fake()->randomElement(['pendente', 'em_andamento', 'concluida']),
            'prazo' => $prazo ? $prazo->format('Y-m-d') : null,
        ];
    }

    /**
     * Estado: tarefa pendente 
     */
    public function pendente(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pendente'
        ]);
    }

    /**
     * Estado: tarefa em andamento 
     */
    public function emAndamento(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'em_andamento'
        ]);
    }

    /**
     * Estado: tarefa concluída 
     */
    public function concluida(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'concluida'
        ]);
    }

    /**
     * Estado: tarefa atrasada (prazo expirado e não concluída)
     */
    public function atrasada(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pendente',
            'prazo' => fake()->dateTimeBetween('-3 month', '-1 day')->format('Y-m-d'),
        ]);
    }
}