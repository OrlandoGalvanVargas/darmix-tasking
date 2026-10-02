#!/bin/sh
set -e

if [ ! -f /var/www/html/.env ]; then
    echo "Creando archivo .env a partir de .env.example..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

if [ ! -d /var/www/html/vendor ]; then
    echo "Instalando dependencias de Composer..."
    composer install --no-interaction --optimize-autoloader
fi

if ! grep -q "^APP_KEY=base64:" /var/www/html/.env; then
    echo "Generando APP_KEY..."
    php artisan key:generate --force
fi

if ! grep -q "^JWT_SECRET=." /var/www/html/.env; then
    echo "Generando JWT_SECRET..."
    php artisan jwt:secret --force
fi

echo "Ejecutando migraciones de base de datos..."
php artisan migrate --force

exec "$@"