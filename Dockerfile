FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]