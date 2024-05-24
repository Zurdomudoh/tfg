<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class GiftUserController extends Controller
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
