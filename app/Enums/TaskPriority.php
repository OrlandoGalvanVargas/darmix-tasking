<?php

namespace App\Enums;

enum TaskPriority: string
{
    case Low    = 'low';
    case Medium = 'medium';
    case High   = 'high';

    public function label(): string
    {
        return match ($this) {
            self::Low    => 'Baja',
            self::Medium => 'Media',
            self::High   => 'Alta',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Low    => 'green',
            self::Medium => 'yellow',
            self::High   => 'red',
        };
    }

    public function weight(): int
    {
        return match ($this) {
            self::Low    => 1,
            self::Medium => 2,
            self::High   => 3,
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function isValid(string $value): bool
    {
        return in_array($value, self::values(), true);
    }

    public static function options(): array
    {
        return array_map(
            fn (self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
                'color' => $case->color(),
            ],
            self::cases()
        );
    }
}