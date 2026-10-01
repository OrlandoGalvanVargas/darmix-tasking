<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthService
{
    public function register(array $data): array
    {
        $user = User::create($data);

        $token = $this->guard()->login($user);

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $credentials): array
    {
        $token = $this->guard()->attempt($credentials);

        if (! $token) {
            throw ApiException::unauthorized('Credenciales inválidas.');
        }

        $user = $this->guard()->user();

        return ['user' => $user, 'token' => $token];
    }

    public function logout(): void
    {
        $this->guard()->logout(true);
    }

    public function refresh(): string
    {
        $newToken = $this->guard()->refresh();

        return $newToken;
    }

    public function tokenData(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60,
        ];
    }

    private function guard(): JWTGuard
    {
        $guard = auth('api');

        return $guard;
    }
}
