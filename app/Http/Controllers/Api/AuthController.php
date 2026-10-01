<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $auth,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->auth->register($request->validated());

        return ApiResponse::created([
            'user' => new UserResource($result['user']),
            'token' => $this->auth->tokenData($result['token']),
        ], 'Usuario registrado correctamente.');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->auth->login($request->validated());

        return ApiResponse::success([
            'user' => new UserResource($result['user']),
            'token' => $this->auth->tokenData($result['token']),
        ], 'Inicio de sesión exitoso.');
    }

    public function logout(): JsonResponse
    {
        $this->auth->logout();

        return ApiResponse::noContent('Sesión cerrada correctamente.');
    }

    public function refresh(): JsonResponse
    {
        $token = $this->auth->refresh();

        return ApiResponse::success(
            $this->auth->tokenData($token),
            'Token renovado correctamente.'
        );
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(
            new UserResource($request->user()),
            'Usuario autenticado obtenido correctamente.'
        );
    }
}
