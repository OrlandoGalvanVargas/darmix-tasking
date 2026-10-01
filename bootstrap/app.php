<?php

use App\Exceptions\ApiException;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use App\Support\ApiResponse;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            ForceJsonResponse::class,
        ]);

        $middleware->alias([
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );

        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: 'Los datos proporcionados no son válidos.',
                status: 422,
                errors: $e->errors(),
                code: 'VALIDATION_ERROR',
            );
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: $e->getMessage() ?: 'No autenticado.',
                status: 401,
                code: 'UNAUTHENTICATED',
            );
        });

        $exceptions->render(function (AuthorizationException|AccessDeniedHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: $e->getMessage() ?: 'No tienes permiso para esta acción.',
                status: 403,
                code: 'FORBIDDEN',
            );
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            $model = class_basename($e->getModel());

            return ApiResponse::error(
                message: "Recurso {$model} no encontrado.",
                status: 404,
                code: 'RESOURCE_NOT_FOUND',
            );
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: 'Endpoint no encontrado.',
                status: 404,
                code: 'ENDPOINT_NOT_FOUND',
            );
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: 'Método HTTP no permitido para esta ruta.',
                status: 405,
                code: 'METHOD_NOT_ALLOWED',
            );
        });

        $exceptions->render(function (ThrottleRequestsException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
                status: 429,
                code: 'TOO_MANY_REQUESTS',
            );
        });

        $exceptions->render(function (ApiException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) return null;

            return ApiResponse::error(
                message: $e->getMessage(),
                status: $e->getStatusCode(),
                errors: $e->getErrors(),
                code: $e->getErrorCode(),
            );
        });
    })->create();