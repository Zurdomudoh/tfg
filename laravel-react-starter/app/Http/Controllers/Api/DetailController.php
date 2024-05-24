<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Detail;
use Illuminate\Http\Request;

class DetailController extends Controller
{
    public function index()
    {
        // Obtener todos los detalles
        $details = Detail::all();

        // Devolver los detalles como JSON
        return response()->json($details, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gift_id' => 'required|exists:gifts,id',
            'link' => 'required|url',
            'price' => 'required|numeric',
            'delivery' => 'required|string',
            'source' => 'required|string',
            'thumbnail' => 'required|url', 
        ]);

        Detail::create($validated);

        return response()->json(['message' => 'Detail was successfully added'], 201);
    }

    public function update(Request $request, $id)
    {
        // Validar los datos recibidos
        $validated = $request->validate([
            'gift_id' => 'required|exists:gifts,id',
            'link' => 'required|url',
            'price' => 'required|numeric',
            'delivery' => 'required|string',
            'source' => 'required|string',
            'thumbnail' => 'required|url', 
        ]);

        // Buscar el detalle correspondiente al gift_id proporcionado
        $detail = Detail::where('gift_id', $request->gift_id)->firstOrFail();

        // Actualizar el detalle encontrado
        $detail->update($validated);

        return response()->json(['message' => 'Detail was successfully updated'], 200);
    }
}
