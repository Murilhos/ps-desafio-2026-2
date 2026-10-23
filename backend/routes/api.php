<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', function (Request $request) {
        return response()->json(Auth::user(), Response::HTTP_OK);
    });
});

Route::middleware(['auth:sanctum', 'can:admin'])->group(function () {
    Route::apiResource('/users', UserController::class);
});

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::apiResource('membros', \App\Http\Controllers\MembroController::class);
Route::apiResource('projetos', \App\Http\Controllers\ProjetoController::class); //Estava escrito resource, ao invés de apiResource. Route::resource cria rotas para views (interface web), enquanto apiResource cria rotas para API.

// Tarefas
Route::apiResource('tarefas', \App\Http\Controllers\TarefaController::class);

//Alocação de membros aos projetos
Route::prefix('projetos/{projeto}/membros')->group(function () {
    Route::get('/', [\App\Http\Controllers\AlocacaoController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\AlocacaoController::class, 'store']);
    Route::delete('/{membro}', [\App\Http\Controllers\AlocacaoController::class, 'destroy']);
});

require __DIR__.'/auth.php';
