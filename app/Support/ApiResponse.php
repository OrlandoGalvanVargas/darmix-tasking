<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'OK',
        int $status = Response::HTTP_OK,
        array $meta = [],
    ): JsonResponse {
        $payload = ['success' => true, 'message' => $message];

        if ($data !== null) {
            $payload['data'] = $data;
        }

        if (! empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    public static function created(mixed $data = null, string $message = 'Recurso creado correctamente.'): JsonResponse
    {
        return self::success($data, $message, Response::HTTP_CREATED);
    }

    public static function noContent(string $message = 'Operación exitosa.'): JsonResponse
    {
        return self::success(null, $message, Response::HTTP_OK);
    }

    public static function error(
        string $message,
        int $status = Response::HTTP_BAD_REQUEST,
        array $errors = [],
        ?string $code = null,
    ): JsonResponse {
        $payload = ['success' => false, 'message' => $message];

        if (! empty($errors)) {
            $payload['errors'] = $errors;
        }

        if ($code !== null) {
            $payload['code'] = $code;
        }

        return response()->json($payload, $status);
    }

    public static function notFound(string $message = 'Recurso no encontrado.'): JsonResponse
    {
        return self::error($message, Response::HTTP_NOT_FOUND, code: 'NOT_FOUND');
    }

    public static function unauthorized(string $message = 'No autenticado.'): JsonResponse
    {
        return self::error($message, Response::HTTP_UNAUTHORIZED, code: 'UNAUTHENTICATED');
    }

    public static function forbidden(string $message = 'No autorizado.'): JsonResponse
    {
        return self::error($message, Response::HTTP_FORBIDDEN, code: 'FORBIDDEN');
    }

    public static function validation(array $errors, string $message = 'Datos inválidos.'): JsonResponse
    {
        return self::error($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors, 'VALIDATION_ERROR');
    }

    public static function paginated(
        LengthAwarePaginator $paginator,
        string $resourceClass,
        string $message = 'OK',
    ): JsonResponse {
        return self::success(
            data: $resourceClass::collection($paginator->items()),
            message: $message,
            meta: [
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page'     => $paginator->perPage(),
                    'total'        => $paginator->total(),
                    'last_page'    => $paginator->lastPage(),
                    'from'         => $paginator->firstItem(),
                    'to'           => $paginator->lastItem(),
                ],
            ],
        );
    }
}