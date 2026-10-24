<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateMembroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; //Estava como falso e estava bloqueado as requisições de update, alterei para true.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nome' => ['sometimes', 'required', 'string', 'max:255'], /*Pelo o que eu entendi, o 'sometimes' significa que o campo só vai validar SE a chave vier no JSON da requisição. 
            Caso o usuário enviar no JSON um nome vazio por exemplo, o sometimes vê que existe a chave, mas como não tinha o 'required' antes e nem 'string', ele aceitaria o valor NULL, tentando salvar nome=NULL no banco*/
            'email' => [
                'sometimes', 
                'required', 
                'string', 
                'email', 
                'max:255',
                Rule::unique('membros', 'email')->ignore($this->route('membro'))
                /*Aqui a IA me ajudou pois eu não sabia por que o banco tava me bloqueado mudar e como fazer para corrigir.*/
                ],
            'senha' => [
                'sometimes', 
                'required', 
                'string', 
                'max:255',
                    Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ],
            'cor_favorita' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data_aniversario' => ['sometimes', 'nullable','date'],
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp'],
        ];
    }
}
