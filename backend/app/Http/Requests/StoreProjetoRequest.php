<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        ];
    }
}
