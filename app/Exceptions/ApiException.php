<?php

namespace App\Exceptions;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ApiException extends Exception
{
    public function __construct(
        string $message,
        private readonly int $statusCode = Response::HTTP_BAD_REQUEST,
        private readonly array $errors = [],
        private readonly ?string $errorCode = null,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, $statusCode, $previous);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getErrorCode(): ?string
    {
        return $this->errorCode;
    }

    public static function unauthorized(string $message = 'No autenticado.'): self
    {
        return new self($message, Response::HTTP_UNAUTHORIZED, errorCode: 'UNAUTHENTICATED');
    }

    public static function forbidden(string $message = 'No autorizado.'): self
    {
        return new self($message, Response::HTTP_FORBIDDEN, errorCode: 'FORBIDDEN');
    }

    public static function notFound(string $message = 'Recurso no encontrado.'): self
    {
        return new self($message, Response::HTTP_NOT_FOUND, errorCode: 'NOT_FOUND');
    }

    public static function conflict(string $message = 'Conflicto con el estado actual.'): self
    {
        return new self($message, Response::HTTP_CONFLICT, errorCode: 'CONFLICT');
    }

    public static function validation(array $errors, string $message = 'Datos inválidos.'): self
    {
        return new self($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors, 'VALIDATION_ERROR');
    }

    public static function business(string $message, ?string $code = 'BUSINESS_RULE'): self
    {
        return new self($message, Response::HTTP_UNPROCESSABLE_ENTITY, errorCode: $code);
    }
}
