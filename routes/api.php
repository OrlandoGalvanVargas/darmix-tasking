<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json([
    'success' => true,
    'message' => 'pong',
    'data'    => ['timestamp' => now()->toIso8601String()],
]));

// ---------- Auth (público) ----------
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'register')->middleware('throttle:register');
    Route::post('login',    'login')->middleware('throttle:login');
    Route::post('refresh',  'refresh');
});

// ---------- API protegida ----------
Route::middleware(['auth:api', 'throttle:api'])->group(function () {
    // Auth (autenticado)
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::get('me',       'me');
    });

    // CRUD Projects
    Route::apiResource('projects', ProjectController::class);

    // CRUD Tasks
    Route::apiResource('tasks', TaskController::class);
});