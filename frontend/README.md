<div align="center">

# Task Manager (Frontend)

SPA en React 19 y TypeScript que consume la API RESTful del backend Laravel.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?style=flat-square)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

El backend (Laravel 12 + JWT) se documenta en [`backend/README.md`](../backend/README.md).

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Cobertura de requisitos](#cobertura-de-requisitos)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Instalación local](#instalación-local)
5. [Instalación con Docker](#instalación-con-docker)
6. [Combinaciones con el backend](#combinaciones-con-el-backend)
7. [Variables de entorno](#variables-de-entorno)
8. [Modos de operación](#modos-de-operación)
9. [Credenciales de prueba](#credenciales-de-prueba)
10. [Sistema de diseño](#sistema-de-diseño)
11. [Consumo de la API](#consumo-de-la-api)
12. [Arquitectura y patrones](#arquitectura-y-patrones)
13. [Tests](#tests)
14. [Scripts disponibles](#scripts-disponibles)
15. [Decisiones técnicas](#decisiones-técnicas)

---

## Stack tecnológico

| Capa                | Tecnología                             | Motivo                                                              |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| Build               | Vite 8                                 | Servidor de desarrollo con HMR y build de producción optimizado     |
| UI                  | React 19 + TypeScript                  | Tipado de extremo a extremo con los contratos de la API             |
| Estilos             | Tailwind CSS v4                        | Configuración CSS-first; tokens semánticos con `@theme inline`      |
| Routing             | React Router 7 (`createBrowserRouter`) | Layouts anidados, guards con `<Outlet />` y `errorElement` por ruta |
| Estado del servidor | TanStack Query v5                      | Caché, reintentos selectivos e invalidación de consultas            |
| Estado del cliente  | Zustand                                | Store mínimo para la sesión, con persistencia parcial               |
| HTTP                | Axios                                  | Interceptores para JWT, refresh y normalización de errores          |
| Formularios         | react-hook-form + Zod                  | Validación declarativa y tipos inferidos del esquema                |
| Notificaciones      | Sonner                                 | Toasts ligeros y accesibles                                         |
| Errores de render   | react-error-boundary                   | Pantalla de respaldo global sin clases propias                      |
| Fuente              | `@fontsource-variable/inter`           | Inter autoalojada; funciona sin conexión                            |
| Tests               | Vitest + React Testing Library         | Estándar del ecosistema Vite                                        |
| Producción          | Nginx (Alpine)                         | Sirve el SPA y actúa como reverse proxy hacia la API                |

---

## Cobertura de requisitos

| Requisito                             | Implementación                                                             |
| ------------------------------------- | -------------------------------------------------------------------------- |
| Pantalla de login y registro          | `src/pages/Login.tsx` y `Register.tsx` (pantalla dividida en escritorio)   |
| Listado de proyectos del usuario      | `src/pages/Projects.tsx` + `useProjectsList()`                             |
| Tareas al seleccionar un proyecto     | `src/pages/ProjectDetail.tsx` + `useTasksList({ project_id })`             |
| CRUD de tareas y cambio de estado     | `TaskFormModal`, `TaskCard` y mutaciones con invalidación de caché         |
| Filtros por estado y prioridad        | `TaskFilters` (estado, prioridad y búsqueda con debounce de 350 ms)        |
| Componentes funcionales y hooks       | Solo componentes funcionales y hooks por dominio                           |
| Consumo de la API                     | Axios con interceptores (`src/services/http/client.ts`)                    |
| Manejo de estado                      | Zustand (sesión) + TanStack Query (datos del servidor)                     |
| Formularios con validación en cliente | react-hook-form + esquemas Zod en `src/schemas/`                           |
| Interfaz responsive con Tailwind      | Tokens semánticos, layouts adaptativos y tema claro/oscuro                 |
| Estados de carga, vacío y error       | `Spinner`, `Skeleton`, `EmptyState`, `ErrorState` y `AppErrorBoundary`     |
| Componentes reutilizables             | `Button`, `Input`, `Select`, `Textarea`, `Modal`, `Badge`, `Pagination`... |
| Organización de carpetas              | `components`, `pages`, `hooks`, `services`, `schemas`, `store`, `types`    |
| Tests                                 | Vitest + React Testing Library                                             |
| Paginación                            | Del lado del servidor, con `meta.pagination` del backend                   |

**Extras implementados:**

| Extra                                       | Implementación                                                       |
| ------------------------------------------- | -------------------------------------------------------------------- |
| Modo demo local sin backend                 | Fachada de API con adaptador HTTP y adaptador `localStorage`         |
| Banner de modo demo con reinicio de datos   | `DemoModeBanner`                                                     |
| Detección de conexión                       | `useOnlineStatus` + `OfflineBanner` (`aria-live`)                    |
| Tema claro, oscuro y de sistema             | `useTheme` + `ThemeToggle`, con script anti-parpadeo en `index.html` |
| Dark mode sin clases `dark:` en componentes | Variables CSS + `@theme inline`                                      |
| Docker con reverse proxy                    | `Dockerfile` multi-stage, `nginx.conf` y `docker-compose.yml`        |

---

## Estructura del proyecto

```text
frontend/
├── src/
│   ├── app/                # Providers, router, queryClient y bootstrap
│   │   ├── bootstrap.ts    # Detección del modo (remote/local) antes del render
│   │   ├── providers.tsx   # ErrorBoundary, QueryClient, Toaster y banners
│   │   ├── queryClient.ts  # Configuración de TanStack Query y errores globales
│   │   └── router.tsx      # createBrowserRouter con layouts y guards
│   ├── components/
│   │   ├── ui/             # Button, Input, Select, Modal, Badge, Spinner...
│   │   ├── layout/         # Layouts, guards, banners y selector de tema
│   │   ├── projects/       # ProjectCard, ProjectFormModal
│   │   └── tasks/          # TaskCard, TaskFormModal, TaskFilters
│   ├── config/env.ts       # Validación del entorno con Zod
│   ├── constants/          # api, routes, storage y task (fuente única de textos)
│   ├── hooks/              # useAuth, useProjects, useTasks, useTheme...
│   ├── lib/                # Utilidades (cn, formato de fechas)
│   ├── pages/              # Login, Register, Projects, ProjectDetail, NotFound
│   ├── schemas/            # Esquemas Zod por dominio
│   ├── services/
│   │   ├── api.ts          # Fachada que elige HTTP o local en tiempo de ejecución
│   │   ├── repository.ts   # Detección del modo (auto/remote/local)
│   │   ├── auth/           # authService (HTTP)
│   │   ├── projects/       # projectService (HTTP)
│   │   ├── tasks/          # taskService (HTTP)
│   │   ├── http/           # Cliente Axios, refresh single-flight y ApiError
│   │   ├── local/          # Implementación local (modo demo)
│   │   └── storage/        # tokenStorage
│   ├── store/              # Stores de Zustand
│   ├── test/               # Configuración de Vitest
│   ├── types/              # Contratos tipados de la API
│   ├── index.css           # Tokens de diseño
│   └── main.tsx            # Bootstrap y render
├── Dockerfile              # Build multi-stage (Node → Nginx)
├── docker-compose.yml      # Red compartida con el backend
├── nginx.conf              # SPA + reverse proxy hacia /api/
├── vite.config.ts          # Plugins, alias y proxy de desarrollo
├── vitest.config.ts
└── .env.example
```

---

## Instalación local

**Requisitos:** Node.js 20.19+ o 22.12+ (lo exige Vite 8) y npm 10 o superior. El backend debe estar en ejecución en `http://127.0.0.1:8000` (consulta el [README del backend](../backend/README.md)), o bien puedes usar el [modo demo](#modos-de-operación).

**1. Clonar el repositorio** (omite este paso si ya lo hiciste para el backend):

```bash
git clone https://github.com/OrlandoGalvanVargas/grupo-balak-task-manager.git
```

**2. Entrar a la carpeta del proyecto:**

```bash
cd grupo-balak-task-manager
```

**3. Entrar a la carpeta del frontend:**

```bash
cd frontend
```

**4. Instalar las dependencias:**

```bash
npm install
```

**5. Crear el archivo de entorno:**

```bash
cp .env.example .env
```

**6. Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

**7. Abrir la aplicación:**

```text
http://localhost:5173
```

El proxy de Vite (`vite.config.ts`) redirige `/api/*` a `http://127.0.0.1:8000`, por lo que en desarrollo no hay problemas de CORS.

---

## Instalación con Docker

Alternativa que no requiere Node.js instalado. El frontend corre en su propio contenedor y se comunica con el backend a través de una red de Docker compartida.

**Requisitos:** Docker y Docker Compose v2 (comando `docker compose`).

```text
┌──────────────────────────────┐         ┌──────────────────────────────┐
│   task_manager_frontend      │         │   task_manager_backend_web   │
│   Nginx :80 → host :3000     │ ──api──▶│   Nginx :80                  │
│                              │         │                              │
│   · Sirve el SPA (dist/)     │         │   · Sirve Laravel            │
│   · Reverse proxy /api/*     │         │   · PHP-FPM upstream         │
└──────────────────────────────┘         └──────────────────────────────┘
              │                                        │
              └────────── task_manager_net ────────────┘
                     (red externa compartida)
```

**1. Crear la red compartida** (solo la primera vez; si ya existe, Docker lo avisa y puedes continuar):

```bash
docker network create task_manager_net
```

**2. Levantar el backend con Docker.** Sigue la sección [Instalación con Docker del backend](../backend/README.md#instalación-con-docker), incluidas las migraciones y los seeders. El contenedor del backend debe estar en la red `task_manager_net`.

**3. Clonar el repositorio** (omite este paso si ya lo hiciste):

```bash
git clone https://github.com/OrlandoGalvanVargas/grupo-balak-task-manager.git
```

**4. Entrar a la carpeta del frontend:**

```bash
cd grupo-balak-task-manager/frontend
```

**5. Construir y levantar el contenedor:**

```bash
docker compose up --build -d
```

**6. Abrir la aplicación:**

```text
http://localhost:3000
```

**7. Verificar la conexión con la API.** A través del proxy de Nginx:

```bash
curl http://localhost:3000/api/ping
```

Respuesta esperada:

```json
{
  "success": true
}
```

### Comandos útiles de Docker

Comprobar la comunicación interna entre contenedores:

```bash
docker exec -it task_manager_frontend wget -qO- http://task_manager_backend_web:80/api/ping
```

Ver los logs del frontend:

```bash
docker logs -f task_manager_frontend
```

Ver los logs del backend:

```bash
docker logs -f task_manager_backend_web
```

Reconstruir el frontend sin caché tras cambios en el código:

```bash
docker compose build --no-cache
```

```bash
docker compose up -d
```

Detener el contenedor:

```bash
docker compose down
```

### Notas sobre la imagen

El `Dockerfile` usa un build **multi-stage**:

1. **Build:** imagen de Node (alpine), instala dependencias con `npm ci` (build reproducible), compila con `npm run build` y fija `VITE_API_URL=/api` para que la app use el reverse proxy.
2. **Runtime:** imagen `nginx:alpine` con el `dist/` resultante y `nginx.conf`. La imagen final es pequeña y no contiene Node.

El `nginx.conf` cumple dos funciones:

- **Sirve el SPA** con `try_files $uri $uri/ /index.html`, necesario para que React Router resuelva rutas profundas como `/projects/42` al recargar.
- **Reverse proxy hacia `/api/`:** reenvía las peticiones al backend por DNS interno de Docker (`task_manager_backend_web:80`).

---

## Combinaciones con el backend

Cada parte puede ejecutarse de forma local o con Docker. Estas son las combinaciones y su estado:

| Frontend                           | Backend                                  | Estado       | Cómo se conecta                                                               |
| ---------------------------------- | ---------------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| Local (`npm run dev`, puerto 5173) | Local (`php artisan serve`, puerto 8000) | Soportada    | Proxy de Vite hacia `127.0.0.1:8000`                                          |
| Local                              | Docker (puerto 8000 publicado)           | Soportada    | Mismo proxy de Vite; el puerto 8000 es el mismo                               |
| Docker (puerto 3000)               | Docker                                   | Soportada    | Red `task_manager_net` y proxy de Nginx                                       |
| Docker                             | Local (`php artisan serve`)              | No soportada | El contenedor no alcanza el `127.0.0.1` del host; la app entrará en modo demo |
| Cualquiera                         | Sin backend                              | Soportada    | [Modo demo local](#modos-de-operación)                                        |

Recomendación: ejecuta ambos en el mismo modo (los dos locales o los dos en Docker).

---

## Variables de entorno

Archivo `.env` (copia de `.env.example`):

```env
# URL base de la API.
# Desarrollo: "/api" usa el proxy de Vite hacia http://127.0.0.1:8000
# Docker: "/api" usa el reverse proxy de Nginx
# Backend externo: "https://tu-backend.com/api"
VITE_API_URL=/api

# auto   → hace ping al backend al arrancar; si no responde, usa el modo demo local
# remote → siempre usa HTTP (falla con error de red si el backend está caído)
# local  → siempre usa datos locales, ignorando el backend
VITE_API_MODE=auto
```

| Variable        | Descripción        | Valores                                 |
| --------------- | ------------------ | --------------------------------------- |
| `VITE_API_URL`  | URL base de la API | `/api` o una URL absoluta               |
| `VITE_API_MODE` | Modo de operación  | `auto` (por defecto), `remote`, `local` |

El entorno se valida una sola vez al arrancar con Zod (`src/config/env.ts`). Si falta una variable o es inválida, la aplicación falla con un mensaje claro en consola en lugar de arrancar con una configuración rota.

---

## Modos de operación

La aplicación funciona con o sin backend, según `VITE_API_MODE`:

| Modo                 | Comportamiento                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `auto` (por defecto) | Hace `GET /api/ping` al arrancar (timeout de 3 s). Si el backend responde, lo usa; si no, activa el **modo demo local**. |
| `remote`             | Siempre usa el backend. Si está caído, las peticiones fallan con error de red.                                           |
| `local`              | Siempre usa datos locales en `localStorage`, sin llamadas HTTP.                                                          |

### Modo demo local

Se activa cuando el backend no está disponible (por ejemplo, si el frontend se publica sin backend). Incluye:

- **Datos semilla** equivalentes a los del seeder del backend (mismos usuarios y proyectos de ejemplo).
- **CRUD completo** de proyectos y tareas, persistido en `localStorage`.
- **Banner "DEMO"** visible, con el botón **Reiniciar datos demo**.
- **Latencia simulada** (~200 ms) para que los estados de carga sean visibles.

Para probarlo, fuerza el modo local:

```env
VITE_API_MODE=local
```

```bash
npm run dev
```

O deja `VITE_API_MODE=auto` y apaga el backend: la aplicación detecta que no responde y cae al modo local.

**Reiniciar los datos demo** desde el banner, o manualmente desde la consola del navegador:

```js
localStorage.removeItem("task-manager:local-db");
```

```js
location.reload();
```

### Limitaciones del modo demo

- Los datos locales **no se sincronizan** con el backend; al cambiar de modo, se empieza de cero.
- Las contraseñas se guardan en `localStorage` **en texto plano**, porque no hay backend que las cifre. No uses credenciales reales.
- No hay límite de intentos, políticas de autorización ni validaciones complejas de unicidad: es una simulación de la interfaz.

---

## Credenciales de prueba

Las mismas que en el backend, también disponibles en el modo demo local:

| Usuario      | Email                  | Contraseña    | Descripción                                                           |
| ------------ | ---------------------- | ------------- | --------------------------------------------------------------------- |
| Usuario Demo | `demo@grupobalak.test` | `password123` | Usuario principal con proyectos y tareas de ejemplo                   |
| Otro Usuario | `otro@grupobalak.test` | `password123` | Usuario secundario, útil para comprobar el aislamiento entre usuarios |

---

## Sistema de diseño

### Tokens semánticos

Los colores viven como **variables CSS** en `src/index.css` y se exponen como utilidades de Tailwind mediante `@theme inline`. El tema oscuro funciona **sin clases `dark:`** en los componentes: solo cambian los valores de las variables.

| Categoría   | Utilidades                                                                        |
| ----------- | --------------------------------------------------------------------------------- |
| Superficies | `bg-background`, `bg-surface`, `bg-surface-muted`                                 |
| Texto       | `text-foreground`, `text-foreground-muted`                                        |
| Marca       | `bg-primary`, `text-primary`, `hover:bg-primary-hover`, `text-primary-foreground` |
| Acento      | `bg-accent`, `text-accent`, `bg-accent-soft`                                      |
| Semánticos  | `info`, `success`, `warning`, `danger` (con variantes `-soft` para fondos)        |

**Regla del proyecto:** los componentes usan solo estas utilidades; nunca colores literales (`bg-blue-500`) ni clases `dark:`. Cambiar la paleta completa implica editar un único archivo.

Los textos y tonos de estado y prioridad de las tareas se definen una sola vez en `src/constants/task.ts`; los componentes no escriben etiquetas a mano.

### Tema claro, oscuro y de sistema

- Selector `ThemeToggle`, accesible con teclado.
- Persistido en `localStorage` con la clave `task-manager:theme`.
- Un script en `index.html` aplica la clase `dark` **antes** de que cargue React, evitando el parpadeo al recargar.
- `useTheme` reacciona a los cambios del sistema operativo cuando el modo es `system`.

### Componentes

| Categoría         | Componentes                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| Primitivos        | `Button`, `Input`, `Select`, `Textarea`, `Spinner`, `Skeleton`                                                        |
| Retroalimentación | `Badge`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `Modal`                                                         |
| Navegación        | `Pagination`, `ThemeToggle`                                                                                           |
| Layout            | `AuthLayout`, `AppLayout`, `ProtectedRoute`, `PublicOnlyRoute`, `OfflineBanner`, `DemoModeBanner`, `AppErrorBoundary` |

---

## Consumo de la API

### Cliente HTTP (`src/services/http/client.ts`)

- **Interceptor de petición:** añade `Authorization: Bearer <token>` cuando hay sesión.
- **Interceptor de respuesta:**
  - Normaliza los errores de Axios a un `ApiError` tipado (`code`, `status`, `errors`).
  - Ante un `401` en una ruta protegida, intenta el refresh del token.
  - Ante un `401` en `/auth/login`, `/auth/register` o `/auth/refresh` **no** reintenta, para evitar bucles y mensajes confusos (en el login significa "credenciales incorrectas").

### Refresh del JWT

El backend usa **un único token con dos duraciones**:

| Concepto          | Valor por defecto | Significado                                    |
| ----------------- | ----------------- | ---------------------------------------------- |
| `JWT_TTL`         | 60 min            | Vida del token para peticiones normales        |
| `JWT_REFRESH_TTL` | 14 días           | Plazo máximo para renovar un token ya expirado |

Flujo:

1. El token expira y la siguiente petición recibe `401`.
2. El interceptor llama a `POST /auth/refresh` con el token expirado.
3. El backend devuelve un token nuevo.
4. La petición original se reintenta con el token nuevo.
5. Si el refresh falla (por ejemplo, pasados los 14 días), se elimina la sesión y se redirige a `/login`.

**Single-flight:** si varias peticiones reciben `401` a la vez, se ejecuta **un solo** refresh y todas esperan la misma promesa (`src/services/http/refresh.ts`).

### Formato de respuestas

Éxito:

```json
{
  "success": true,
  "message": "Tareas obtenidas correctamente.",
  "data": [],
  "meta": {
    "pagination": {
      "current_page": 1,
      "per_page": 15,
      "total": 0,
      "last_page": 1,
      "from": null,
      "to": null
    }
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Los datos proporcionados no son válidos.",
  "errors": { "email": ["El campo email es obligatorio."] },
  "code": "VALIDATION_ERROR"
}
```

Con `code === 'VALIDATION_ERROR'`, los errores se asignan a los campos del formulario (`setError` de react-hook-form). El resto de errores se muestran como toasts desde un único punto (`QueryCache` y `MutationCache`).

---

## Arquitectura y patrones

| Patrón                     | Dónde se aplica                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| Custom hooks por dominio   | `useProjects`, `useTasks`, `useAuth`                                                      |
| Servicios por dominio      | `authService`, `projectService`, `taskService`                                            |
| Fachada de API             | `services/api.ts` elige HTTP o `localStorage` en tiempo de ejecución                      |
| Estado del servidor        | TanStack Query: caché por `queryKey`, invalidación acotada y `placeholderData` al paginar |
| Estado del cliente         | Zustand con `partialize` para persistir solo la sesión                                    |
| Formularios                | react-hook-form + Zod (`z.infer` para los tipos)                                          |
| Layouts con `<Outlet />`   | `AppLayout`, `AuthLayout`, `ProtectedRoute`, `PublicOnlyRoute`                            |
| Errores centralizados      | `ApiError` tipado, interceptores de Axios y toasts globales                               |
| Tokens de diseño           | Variables CSS + `@theme inline`                                                           |
| Refresh single-flight      | Una promesa compartida entre peticiones concurrentes                                      |
| Bootstrap asíncrono        | `await bootstrap()` resuelve el modo (remote/local) antes del primer render               |
| Tarjeta clicable accesible | `ProjectCard` con patrón stretched-link                                                   |

---

## Tests

Ejecutar toda la suite:

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

Con cobertura:

```bash
npm run test:coverage
```

Archivos de test:

- **`Button.test.tsx`:** render, `onClick`, `disabled` y estado de carga con bloqueo de clics.
- **`Input.test.tsx`:** etiqueta asociada, error con `aria-invalid` y escritura.
- **`auth.test.ts`:** esquemas de login y registro (caso válido, email inválido, contraseña corta y contraseñas que no coinciden).

Las pruebas priorizan el **comportamiento del usuario** (`getByRole`, `userEvent`) sobre los detalles de implementación: no se comprueban clases CSS ni la estructura del DOM.

---

## Scripts disponibles

| Script                  | Descripción                                            |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | Servidor de desarrollo en `http://localhost:5173`      |
| `npm run build`         | Comprobación de tipos y build de producción en `dist/` |
| `npm run preview`       | Sirve el build de producción en local                  |
| `npm run lint`          | ESLint                                                 |
| `npm test`              | Tests con Vitest                                       |
| `npm run test:watch`    | Tests en modo watch                                    |
| `npm run test:coverage` | Tests con informe de cobertura                         |

---

## Decisiones técnicas

**react-hook-form + Zod.** Es el estándar del ecosistema: validación declarativa y tipos inferidos del esquema, sin duplicar interfaces. react-hook-form registra los inputs por referencia (no los controla con estado de React) para evitar renders en cada pulsación. Coste: dos dependencias adicionales. Si se necesitara el patrón estricto `value`/`onChange` en un campo, la librería ofrece `Controller`.

**Zustand en lugar de Context API.** Permite suscribirse por selector, de modo que un cambio en la sesión no re-renderiza todo el árbol. `partialize` limita lo que se persiste.

**TanStack Query en lugar de `useEffect` + `useState`.** Resuelve caché, deduplicación de peticiones, reintentos, invalidación entre consultas y los estados de carga y error sin código repetido en cada página.

**Tailwind v4 (CSS-first).** Todo el sistema de diseño vive en `src/index.css`, y el tema oscuro se obtiene cambiando variables. Coste: algunos plugins y tutoriales aún asumen la v3.

**Token JWT en `localStorage`.** Es la opción más simple y no requiere cambios en el backend. Coste: es accesible desde JavaScript, por lo que un XSS podría leerlo. Mitigaciones: React escapa el contenido por defecto y el proyecto no usa `dangerouslySetInnerHTML`. La alternativa más robusta es una cookie `HttpOnly`, que exige cambios en el backend; también serían recomendables cabeceras de seguridad (CSP) en Nginx.

**Modo demo local con fachada de API.** Permite mostrar la aplicación completa aunque el backend no esté desplegado. Los servicios HTTP no cambian: la fachada solo decide en ejecución cuál usar. Coste: código adicional (servicios locales y datos semilla) que no se usa contra el backend real.

**Paginación con `meta.pagination` e invalidación de caché.** El backend no devuelve `links` ni embebe el proyecto al crear una tarea; no hacen falta, porque `meta.pagination` basta para el componente de paginación y tras cada mutación se invalida la caché afectada (`taskKeys.all` y `projectKeys.all`). Coste: una consulta adicional tras crear o editar.

**Docker con Nginx como reverse proxy.** El contenedor del frontend es independiente: solo comparte la red `task_manager_net` con el backend. Permite desplegar cada parte por separado y servir el SPA y la API bajo el mismo origen, sin CORS.

**Sin `enum` de TypeScript.** El `tsconfig` de la plantilla activa `erasableSyntaxOnly`, que no admite construcciones sin equivalente directo en JavaScript, como los `enum`. Se usan objetos `as const` y tipos derivados con `keyof typeof`.
