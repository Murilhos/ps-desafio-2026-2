<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Illuminate\Support\Facades\DB;

class UpdateTarefaRequest extends FormRequest
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
            'projeto_id' => ['sometimes', 'required', 'string', Rule::exists('projetos', 'id')],
            'membro_id' => ['sometimes', 'required', 'string', Rule::exists('membros', 'id')],
            'titulo' => ['sometimes', 'required', 'string', 'max:255'],
            'descricao' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::in(['pendente', 'em_andamento', 'concluida'])],
            'prazo' => ['sometimes', 'nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'projeto_id.exists' => 'Projeto não encontrado.',
            'membro_id.exists' => 'Membro não encontrado.',
            'titulo.required' => 'O titulo da tarefa é obrigatório.',
            'status.in' => 'O status deve ser: pendente, em_andamento ou concluida.',
            'prazo.date' => 'O prazo deve ser uma data válida.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $projetoId = $this->input('projeto_id');
            $membroId = $this->input('membro_id');

            if (!$projetoId || !$membroId) return; // Se algum dos campos não estiver presente, não faz a validação adicional

            $alocado = DB::table('membro_projeto')->where('projeto_id', $projetoId)->where('membro_id', $membroId)->exists();

            if (!$alocado) {
                $validator->errors()->add('membro_id', 'Este membro não está alocado neste projeto. Aloque-o primeiro.');
            }
        });
    }
}
