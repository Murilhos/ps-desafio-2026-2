<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProjetoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //Estava como falso e estava bloqueado (403 Forbidden) as requisições de update, alterei para true.
    }

    /*Será se devo criar um método para no caso do usuário só querer atualizar a data fim, e não a data de início? 
    Pois a regra de validação do campo data_fim é que ele seja maior ou igual a data_inicio, então se o usuário só quiser atualizar a data_fim, 
    ele não vai conseguir, pois o campo data_inicio não vai ser enviado na requisição, eu acho.
    Então pensei em criar um método para verificar se o campo data_inicio foi enviado na requisição, e se não foi, então ele vai pegar
    o valor do campo data_inicio do banco de dados e comparar com o valor do campo data_fim enviado na requisição. 
    Mas por enquanto vou deixar assim mesmo, pois não sei se isso é necessário*/

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        //Campo de regras estava vazio, então o $request->validated() não estava validando nada, então adicionei as regras de validação.
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:255'],
            'nome_cliente' => ['sometimes', 'required', 'string', 'max:255'],
            'descricao' => ['sometimes', 'required', 'string'],
            'data_inicio' => ['sometimes', 'required', 'date'],
            'data_fim' => ['sometimes', 'required', 'date', 'after_or_equal:data_inicio'],
            'status' => ['sometimes', 'nullable', Rule::in(['planejado', 'ativo', 'concluido', 'cancelado'])], // Adicionei validação para o campo status
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do projeto é obrigatório.',
            'nome_cliente.required' => 'O nome do cliente é obrigatório.',
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

            //Como no update os campos são opcionais, só valida se ambos vierem na requisição.
            if (!$dataInicio || !$dataFim) return; // Se algum dos campos não estiver presente, não faz a validação adicional

            if ($dataFim < $dataInicio) {
                $validator->errors()->add('data_fim', 'A data de termino deve ser igual ou posterior à data de início.');
            }
        });
    }
}
