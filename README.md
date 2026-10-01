<div align="center">

# Task Manager API

API RESTful para la gestión de proyectos y tareas, construida con Laravel 12 y autenticación JWT.

![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%20%2F%20MariaDB-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Pest%203-F472B6?style=flat-square)
![Code Style](https://img.shields.io/badge/Code%20Style-Laravel%20Pint-FF2D20?style=flat-square&logo=laravel&logoColor=white)

</div>

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Arquitectura](#arquitectura)
3. [Instalación local (XAMPP / MySQL)](#instalación-local-xampp--mysql)
4. [Instalación con Docker](#instalación-con-docker)
5. [Variables de entorno](#variables-de-entorno)
6. [Credenciales de prueba](#credenciales-de-prueba)
7. [Autenticación](#autenticación)
8. [Endpoints](#endpoints)
9. [Formato de respuestas y errores](#formato-de-respuestas-y-errores)
10. [Tests](#tests)
11. [Calidad de código](#calidad-de-código)
12. [Decisiones técnicas](#decisiones-técnicas)

---

## Stack tecnológico

| Componente | Tecnología |
| --- | --- |
| Lenguaje | PHP `^8.2` |
| Framework | Laravel `^12.0` |
| Autenticación | `php-open-source-saver/jwt-auth` `^2.7` |
| Base de datos | MySQL 8 / MariaDB (InnoDB, `utf8mb4`) |
| Tests | Pest 3 + plugin de Laravel |
| Estilo de código | Laravel Pint |

---

## Arquitectura

```text
backend/
├── app/
│   ├── Enums/              # TaskStatus y TaskPriority
│   ├── Exceptions/         # Excepciones de dominio de la API
│   ├── Http/
│   │   ├── Controllers/    # Controladores delgados (Auth, Project, Task)
│   │   ├── Middleware/     # Middlewares propios (respuestas JSON)
│   │   ├── Requests/       # Form Requests: validación de entrada
│   │   └── Resources/      # API Resources: formato de salida
│   ├── Models/             # Eloquent: relaciones, casts y SoftDeletes
│   ├── Policies/           # Autorización: cada usuario solo ve lo suyo
│   ├── Services/           # Lógica de negocio
│   └── Support/            # Utilidades de respuesta estandarizada
├── bootstrap/app.php       # Rutas y manejo global de excepciones
├── database/               # Migraciones, factories y seeders
├── routes/api.php          # Definición de rutas de la API
└── tests/                  # Tests de integración con Pest
```

Flujo de una petición: **Route → Middleware (JWT) → Form Request (validación) → Controller → Service → Model → API Resource**.

---

## Instalación local (XAMPP / MySQL)

**Requisitos:** PHP 8.2 o superior, Composer 2 y MySQL/MariaDB en ejecución.

**1. Clonar el repositorio:**

```bash
git clone https://github.com/OrlandoGalvanVargas/grupo-balak-task-manager.git
```

**2. Entrar a la carpeta del proyecto:**

```bash
cd grupo-balak-task-manager
```

**3. Entrar a la carpeta del backend:**

```bash
cd backend
```

**4. Instalar las dependencias:**

```bash
composer install
```

**5. Crear dos bases de datos vacías** (por ejemplo desde phpMyAdmin, con cotejamiento `utf8mb4_unicode_ci`):

- `task_manager`: base de datos de la aplicación.
- `task_manager_testing`: base de datos exclusiva para los tests.

**6. Crear el archivo de entorno:**

```bash
cp .env.example .env
```

Con XAMPP, los valores habituales en el `.env` son `DB_HOST=127.0.0.1`, `DB_USERNAME=root` y `DB_PASSWORD=` (vacío).

**7. Generar la clave de la aplicación:**

```bash
php artisan key:generate
```

**8. Ejecutar las migraciones y los seeders:**

```bash
php artisan migrate --seed
```

**9. Iniciar el servidor:**

```bash
php artisan serve
```

**10. Verificar que la API responde:**

```text
http://127.0.0.1:8000/api/ping
```

O ejecútalo desde otra terminal:

```bash
curl http://127.0.0.1:8000/api/ping
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

La URL base de la API es `http://127.0.0.1:8000/api`.

---

## Instalación con Docker

Alternativa que no requiere PHP ni MySQL instalados localmente; solo Docker y Docker Compose.

**1. Clonar el repositorio:**

```bash
git clone https://github.com/OrlandoGalvanVargas/grupo-balak-task-manager.git
```

**2. Entrar a la carpeta del proyecto:**

```bash
cd grupo-balak-task-manager
```

**3. Entrar a la carpeta del backend:**

```bash
cd backend
```

**4. Crear el archivo de entorno:**

```bash
cp .env.example .env
```

**5. Construir y levantar los contenedores:**

```bash
docker-compose up -d --build
```

**6. Esperar a que MySQL se inicialice.** La primera vez tarda entre 10 y 15 segundos; espera antes de continuar con el siguiente paso.

**7. Instalar las dependencias dentro del contenedor:**

```bash
docker-compose exec app composer install
```

**8. Generar la clave de la aplicación:**

```bash
docker-compose exec app php artisan key:generate
```

**9. Ejecutar las migraciones y los seeders:**

```bash
docker-compose exec app php artisan migrate:fresh --seed
```

**10. Verificar que la API responde:**

```text
http://localhost:8000/api/ping
```

O ejecútalo desde la terminal:

```bash
curl http://localhost:8000/api/ping
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

La URL base de la API es `http://localhost:8000/api`.

### Comandos útiles de Docker

Ver los logs de la aplicación en tiempo real:

```bash
docker-compose logs -f app
```

Detener los contenedores:

```bash
docker-compose down
```

Volver a levantarlos (sin reconstruir la imagen):

```bash
docker-compose up -d
```

Todos los comandos de `php artisan` en Docker se ejecutan con el prefijo `docker-compose exec app`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `APP_KEY` | Clave de la aplicación (`php artisan key:generate`) | generada |
| `APP_URL` | URL base de la API | `http://127.0.0.1:8000` |
| `DB_CONNECTION` | Driver de base de datos | `mysql` |
| `DB_HOST` / `DB_PORT` | Servidor y puerto de MySQL | `127.0.0.1` / `3306` |
| `DB_DATABASE` | Base de datos de la aplicación | `task_manager` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de MySQL | `root` / (vacío) |
| `JWT_SECRET` | Secreto de firma de tokens. Se incluye un valor de desarrollo en `.env.example`; en producción debe generarse uno propio con `php artisan jwt:secret` | incluido |
| `JWT_TTL` | Vida del token de acceso, en minutos | `60` |
| `JWT_REFRESH_TTL` | Ventana de refresh tras expirar, en minutos | `20160` |
| `JWT_BLACKLIST_GRACE_PERIOD` | Tolerancia en segundos tras un refresh (peticiones concurrentes) | `30` |

---

## Credenciales de prueba

El seeder crea dos usuarios:

| Usuario | Email | Contraseña | Datos |
| --- | --- | --- | --- |
| Usuario Demo | `demo@grupobalak.test` | `password123` | 3 proyectos y 24 tareas |
| Otro Usuario | `otro@grupobalak.test` | `password123` | 1 proyecto con tareas (sirve para verificar el aislamiento entre usuarios) |

---

## Autenticación

La API usa **JWT** enviado en la cabecera `Authorization: Bearer <token>`.

**1. Login.** Devuelve un `access_token`, su tipo y su duración en segundos:

```bash
curl -X POST http://127.0.0.1:8000/api/auth/login -H "Content-Type: application/json" -H "Accept: application/json" -d '{"email":"demo@grupobalak.test","password":"password123"}'
```

**2. Petición protegida.** Sustituye `<access_token>` por el token obtenido:

```bash
curl http://127.0.0.1:8000/api/projects -H "Authorization: Bearer <access_token>" -H "Accept: application/json"
```

**3. Refresh.** `POST /api/auth/refresh` con el token (incluso si ya expiró, dentro de la ventana `JWT_REFRESH_TTL`) devuelve uno nuevo e invalida el anterior.

**4. Logout.** `POST /api/auth/logout` invalida el token actual.

Los endpoints de registro y login tienen limitación de intentos (`throttle`) contra fuerza bruta.

---

## Endpoints

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Login y obtención de token | No |
| POST | `/api/auth/refresh` | Renovar token | Token (puede estar expirado) |
| POST | `/api/auth/logout` | Invalidar token | Sí |
| GET | `/api/auth/me` | Usuario autenticado | Sí |

### Proyectos (`/api/projects`), requiere Bearer token

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/projects` | Listar proyectos del usuario |
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects/{id}` | Detalle del proyecto con sus tareas |
| PUT/PATCH | `/api/projects/{id}` | Actualizar proyecto |
| DELETE | `/api/projects/{id}` | Eliminar proyecto (soft delete) |

### Tareas (`/api/tasks`), requiere Bearer token

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/tasks` | Listar tareas, con filtros |
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/{id}` | Detalle de tarea |
| PUT/PATCH | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea (soft delete) |

**Filtros del listado de tareas** (query params, combinables):

| Parámetro | Valores |
| --- | --- |
| `status` | `pending`, `in_progress`, `completed` |
| `priority` | `low`, `medium`, `high` |

Ejemplo:

```text
GET /api/tasks?status=pending&priority=high
```

**Campos de una tarea:** `title` (obligatorio), `description`, `status` (por defecto `pending`), `priority` (por defecto `medium`), `due_date`, `project_id`.

---

## Formato de respuestas y errores

- **Éxito:** el contenido va bajo la clave `data`.
- **Error:** `message` describe el problema; en validaciones se añade `errors` con el detalle por campo.

```json
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

| Código | Significado |
| --- | --- |
| 200 / 201 | Éxito / recurso creado |
| 401 | Token ausente, inválido, expirado o credenciales incorrectas |
| 403 | El recurso existe pero pertenece a otro usuario |
| 404 | Recurso inexistente |
| 422 | Error de validación |
| 429 | Demasiados intentos (throttle) |
| 500 | Error interno (sin exponer detalles en producción) |

Todas las rutas de `/api/*` responden siempre en JSON, aunque el cliente no envíe la cabecera `Accept`.

---

## Tests

La suite cubre autenticación (registro, login, refresh, logout, perfil), CRUD de proyectos y tareas, filtros, validaciones y las políticas de aislamiento entre usuarios.

**Entorno local:**

```bash
php artisan test
```

**Docker** (los tests se ejecutan dentro del contenedor `app`):

```bash
docker-compose exec app php artisan test
```

### Datos de ejemplo después de ejecutar los tests

Los tests usan `RefreshDatabase`, que recrea las tablas para garantizar el aislamiento entre pruebas. El efecto sobre tus datos depende de la base contra la que corran:

| Los tests corren contra... | Efecto |
| --- | --- |
| `task_manager_testing` (configurada en `phpunit.xml`) | Tus datos de ejemplo no se tocan |
| La misma base de la aplicación (`task_manager`) | Las tablas se vacían y hay que volver a ejecutar el seeder |

Si después de correr los tests ya no encuentras los usuarios y datos de ejemplo, restáuralos con:

```bash
php artisan migrate:fresh --seed
```

En Docker:

```bash
docker-compose exec app php artisan migrate:fresh --seed
```

---

## Calidad de código

El proyecto usa [Laravel Pint](https://laravel.com/docs/pint) para mantener un estilo de código consistente (PSR-12 con las reglas de Laravel).

Formatear todo el código:

```bash
php vendor/bin/pint
```

Solo comprobar el estilo, sin modificar archivos (útil en CI):

```bash
php vendor/bin/pint --test
```

Formatear únicamente los archivos con cambios sin confirmar:

```bash
php vendor/bin/pint --dirty
```

---

## Decisiones técnicas

- **`php-open-source-saver/jwt-auth` en lugar de `tymon/jwt-auth`:** es un fork mantenido y compatible con las versiones actuales de Laravel; mantiene la misma API del paquete original.
- **Autorización con Policies:** además de proteger las rutas con JWT, cada recurso se valida contra su propietario, evitando que un usuario acceda a datos de otro.
- **Enums de PHP para `status` y `priority`:** tipado fuerte en la aplicación y validación centralizada; en base de datos son columnas `string`, más sencillas de evolucionar que un `ENUM` de MySQL.
- **Índices:** compuesto `(project_id, status, priority)` para el filtrado de tareas por proyecto, estado y prioridad, e índice sobre `due_date`. Las llaves foráneas usan `ON DELETE CASCADE`.
- **Controladores delgados:** la validación vive en Form Requests, el formato de salida en API Resources y la lógica de negocio en Services.
- **Eager loading (`with()`)** en los listados para evitar consultas N+1.
- **API sin estado:** no hay sesiones ni cookies; el estado de autenticación viaja en el token.
