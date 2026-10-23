<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreProjetoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'], //Faltava limite de caracteres, adicionei max:255
            'nome_cliente' => ['required', 'string', 'max:255'], //Mesma coisa, adicionei max:255
            'descricao' => ['required', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['required', 'date', 'after_or_equal:data_inicio'], // Data fim valida apenas se for igual ou posterior a data de início.
            'status' => ['nullable', Rule::in(['planejado', 'ativo', 'concluido', 'cancelado'])], // Adicionei validação para o campo status
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do projeto é obrigatório.',
            'nome.max' => 'O nome do projeto não pode ter mais de 255 caracteres.',
            'nome_cliente.required' => 'O nome do cliente é obrigatório.',
            'nome_cliente.max' => 'O nome do cliente não pode ter mais de 255 caracteres.',
            'descricao.required' => 'A descrição do projeto é obrigatória.',
            'data_inicio.required' => 'A data de início é obrigatória.',
            'data_inicio.date' => 'A data de início deve ser uma data válida.',
            'data_fim.required' => 'A data de fim é obrigatória.',
            'data_fim.date' => 'A data de fim deve ser uma data válida.',
            'data_fim.after_or_equal' => 'A data de fim deve ser igual ou posterior à data de início.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $dataInicio = $this->input('data_inicio');
            $dataFim = $this->input('data_fim');

            if (!$dataInicio || !$dataFim) return; // Se algum dos campos não estiver presente, não faz a validação adicional

            if ($dataFim < $dataInicio) {
                $validator->errors()->add('data_fim', 'A data de fim deve ser igual ou posterior à data de início.');
            }
        });
    }
}
