<?php

use App\Models\User;

beforeEach(function () {
    $this->endpoint = '/api/auth';
});

it('registers a new user and returns a token', function () {
    $response = $this->postJson("{$this->endpoint}/register", [
        'name'     => 'Test User',
        'email'    => 'test@example.com',
        'password' => 'secret123',
    ]);

    $response->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email'], 'token' => ['access_token', 'token_type', 'expires_in']]]);

    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
});

it('rejects registration with duplicate email', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->postJson("{$this->endpoint}/register", [
        'name'     => 'Test User',
        'email'    => 'test@example.com',
        'password' => 'secret123',
    ])->assertUnprocessable()
      ->assertJsonPath('code', 'VALIDATION_ERROR')
      ->assertJsonValidationErrors('email');
});

it('validates required fields on registration', function () {
    $this->postJson("{$this->endpoint}/register", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

it('logs in with valid credentials', function () {
    User::factory()->create([
        'email'    => 'test@example.com',
        'password' => 'secret123',
    ]);

    $this->postJson("{$this->endpoint}/login", [
        'email'    => 'test@example.com',
        'password' => 'secret123',
    ])->assertOk()
      ->assertJsonPath('success', true)
      ->assertJsonStructure(['data' => ['token' => ['access_token']]]);
});

it('fails login with wrong credentials', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->postJson("{$this->endpoint}/login", [
        'email'    => 'test@example.com',
        'password' => 'wrong-password',
    ])->assertUnauthorized()
      ->assertJsonPath('code', 'UNAUTHENTICATED');
});

it('requires authentication to access /me', function () {
    $this->getJson("{$this->endpoint}/me")
        ->assertUnauthorized()
        ->assertJsonPath('code', 'UNAUTHENTICATED');
});

it('returns authenticated user on /me', function () {
    $user  = User::factory()->create();
    $token = auth('api')->login($user);

    $this->withToken($token)
        ->getJson("{$this->endpoint}/me")
        ->assertOk()
        ->assertJsonPath('data.id', $user->id);
});

it('refreshes a valid token', function () {
    $user  = User::factory()->create();
    $token = auth('api')->login($user);

    $this->withToken($token)
        ->postJson("{$this->endpoint}/refresh")
        ->assertOk()
        ->assertJsonStructure(['data' => ['access_token']]);
});

it('logs out and invalidates the token', function () {
    $user  = User::factory()->create();
    $token = auth('api')->login($user);

    $this->withToken($token)->postJson("{$this->endpoint}/logout")->assertOk();

    auth('api')->forgetUser();
    auth('api')->setToken($token);

    expect(fn () => auth('api')->authenticate())
        ->toThrow(\Illuminate\Auth\AuthenticationException::class);
});