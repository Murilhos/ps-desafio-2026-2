<?php

namespace App\Http\Controllers;

use App\Models\Tarefa;
use App\Models\Membro;
use App\Http\Requests\StoreTarefaRequest;
use App\Http\Requests\UpdateTarefaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TarefaController extends Controller
{
    protected Tarefa $tarefa;

    public function __construct(Tarefa $tarefa)
    {
        $this->tarefa = $tarefa;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = $this->tarefa->with(['projeto', 'membro']);

        // Filtras
        if ($request->has('projeto_id')) {
            $query->where('projeto_id', $request->input('projeto_id'));
        }

        if ($request->has('membro_id')) {
            $query->where('membro_id', $request->input('membro_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json($query->get(), Response::HTTP_OK);   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTarefaRequest $request)
    {
        $tarefa = $this->tarefa->create($request->validated());

        return response()->json($tarefa->load(['projeto', 'membro']), Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tarefa = $this->tarefa->findOrFail($id);

        return response()->json($tarefa->load(['projeto', 'membro']), Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTarefaRequest $request, string $id)
    {
        $tarefa = $this->tarefa->findOrFail($id);
        $tarefa->update($request->validated());

        return response()->json($tarefa->load(['projeto', 'membro']), Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tarefa = $this->tarefa->findOrFail($id);
        $tarefa->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
