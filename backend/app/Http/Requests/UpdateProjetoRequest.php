<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
        ];
    }
}
