<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\GiftController;
use App\Http\Controllers\Api\DetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    //Rutas para los usuarios
    Route::apiResource('/users', UserController::class);
    
    // Rutas para los regalos
    Route::apiResource('/gifts', GiftController::class);

    // Rutas para los detalles de los regalos
    Route::post('/details', [DetailController::class, 'store']);
    Route::put('/details/{id}', [DetailController::class, 'update']); // Ruta para actualizar detalles
  
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
