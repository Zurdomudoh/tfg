<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserGiftController extends Controller
{
    public function index($id)
    {
        // Obtener el usuario específico
        $user = User::findOrFail($id);

        // Obtener los regalos asociados al usuario a través de la relación giftUsers
        $gifts = $user->giftUsers()->with('gift')->get()->pluck('gift');

        // Devolver los regalos como respuesta
        return response()->json(['gifts' => $gifts], 200);
    }
}
