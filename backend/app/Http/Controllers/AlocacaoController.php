<?php

namespace App\Http\Controllers;

use App\Models\Projeto;
use App\Models\Membro;
use App\Http\Requests\AlocarMembroRequest;
use App\Services\AlocacaoService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class AlocacaoController extends Controller
{
    protected AlocacaoService $alocacaoService;

    public function __construct(AlocacaoService $alocacaoService)
    {
        $this->alocacaoService = $alocacaoService;
    }

    public function index(string $projetoId): JsonResponse
    {
        $projeto = Projeto::findOrFail($projetoId);

        return response()->json($projeto->membros()->get(), Response::HTTP_OK);
    }

    public function store(AlocarMembroRequest $request, string $projetoId): JsonResponse
    {
        $projeto = Projeto::findOrFail($projetoId);
        $membro = Membro::findOrFail($request->input('membro_id'));

        try{
            $this->alocacaoService->alocar($projeto, $membro);

            return response()->json(['message' => "Membro alocado com sucesso."], Response::HTTP_CREATED);
        } catch (Exception $e) {
            throw ValidationException::withMessages(['membro_id' => [$e->getMessage()]]); //Ao mexer no frontend, por conta de que não querer mexer no api.ts, optei por adequar o catch do store para que funcione com ele, a IA me ajudou me recomendando a importar a classe de Exceção 
        }
    }

    public function destroy(String $projetoId, String $membroId): JsonResponse
    {
        $projeto = Projeto::findOrFail($projetoId);
        $membro = Membro::findOrFail($membroId);

        try{
            $this->alocacaoService->desalocar($projeto, $membro);

            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
