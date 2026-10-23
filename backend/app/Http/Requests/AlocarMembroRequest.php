<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AlocarMembroRequest extends FormRequest
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
            'membro_id' => ['required', 'string', Rule::exists('membros', 'id')],
        ];
    }

    public function messages(): array
    {
        return [
            'membro_id.required' => 'Selecione o membro a ser alocado.',
            'membro_id.exists' => 'Membro não encontrado.',
        ];
    }
}
