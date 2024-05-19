<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gift;
use App\Models\GiftUser;
use App\Models\Detail;
use App\Models\User;
use Illuminate\Http\Request;

class GiftController extends Controller
{

    public function index()
    {
        $gifts = Gift::with('giftUsers.user')->get();
        return response()->json(['gifts' => $gifts]);
    }

    public function store(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string',
        'description' => 'required|string',
        'status' => 'required|int',
        'user_id' => 'required|int' // Validar que el ID de usuario exista en la tabla de usuarios
    ]);

    // Crear el regalo
    $gift = Gift::create($data);
    // Si se proporciona un ID de usuario, guardar la relación en la tabla pivote
    if ($request->filled('user_id')) {
        $user = User::findOrFail($request->user_id);
        // Crear una nueva entrada en la tabla pivote gift_user
        GiftUser::create([
            'gift_id' => $gift->id,
            'user_id' => $user->id
        ]);
    }


    return response()->json(['gift' => $gift]);
}  

    public function show(Gift $gift)
    {
        // Cargar la relación con la tabla details
        $giftWithDetails = $gift->load('detail');
        
        return response()->json($giftWithDetails);
    }

    public function update(Request $request, Gift $gift)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'status' => 'required|int',
            'user_id' => 'nullable|exists:users,id' // Validar que el ID de usuario exista en la tabla de usuarios
        ]);
    
        // Actualizar el regalo
        $gift->update($data);
    
        // Si se proporciona un ID de usuario, actualizar la relación en la tabla pivote
        if ($request->filled('user_id')) {
            $user = User::findOrFail($request->user_id);
    
            // Eliminar la relación existente antes de agregar la nueva
            $gift->giftUsers()->delete();
    
            // Crear una nueva entrada en la tabla pivote gift_user
            GiftUser::create([
                'gift_id' => $gift->id,
                'user_id' => $user->id
            ]);
        } else {
            // Si no se proporciona un ID de usuario, eliminar todas las relaciones existentes
            $gift->giftUsers()->delete();
        }
    
        return response()->json($gift);
    }

    public function destroy(Gift $gift)
    {
        $gift->delete();

        return response()->json($gift);
    }

    
    
}
