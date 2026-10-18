<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->has('name'), fn ($query) => $query->orWhere('name', 'like', "%{$request['name']}%"))
            ->when($request->has('email'), fn ($query) => $query->orWhere('email', 'like', "%{$request['email']}%"))
            ->orderBy('created_at', 'desc')
            ->paginate((int) $request->per_page);

        return response()->json($users, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('image', 'public');
            $data['image'] = url('storage/'.$path);
        }

        /** @var User $user */
        $user = User::create($data);

        if ($request['permissions']) {
            $user->assignPermission(...$request['permissions']);
        }

        return response()->json($user, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        return response()->json($user, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if ($request->hasFile('image')) {
            try {
                if ($user['image']) {
                    $image_name = explode('image/', $user['image']);
                    Storage::disk('public')->delete('image/'.$image_name[1]);
                }
            } catch (Throwable) {
            } finally {
                $path = $request->file('image')->store('image', 'public');
                $data['image'] = url('storage/'.$path);
            }
        }

        $user->update($data);

        return response()->json($user, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        //$loggedUser = auth()->user();
        /* Pelo o que eu entendi, o auth()->user() retorna o usuário logado, retornando um objeto e não um array. O problema é que a interface genérica Authenticatable não implementa ArrayAccess 
        então tentar aceder ao campo em $loggedUser ['id'] acaba por dar error. Ademais, auth()->user() também pode retorar null, que foi o que tava travando nas requisições*/
        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'Usuários não podem se deletar.'], Response::HTTP_FORBIDDEN);
        }

        $user->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);

    }
}
