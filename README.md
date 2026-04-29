# Notas API - Documentacion del Backend

## Acceso a la documentacion interactiva

- URL Swagger UI: `http://localhost:3000/api-docs`
- Base URL principal: `http://localhost:3000/api/v1`
- Base URL tecnica (health): `http://localhost:3000/api`

## Autenticacion

La API usa JWT Bearer para endpoints protegidos.

1. Ejecutar `POST /auth/login`
2. Copiar el token recibido
3. En Swagger, usar el boton **Authorize** y pegar: `Bearer <token>`

## APIs incorporadas

### 1) System API

- `GET /health`
- Descripcion: valida estado del servicio.
- Respuesta esperada: `200` con `{ status, message }`.

### 2) Auth API

- `POST /auth/register`
- Descripcion: registra un usuario.
- Body: `name`, `email`, `password`.
- Respuestas: `201` (ok), `400` (datos invalidos o email ya usado).

- `POST /auth/login`
- Descripcion: autentica y devuelve JWT.
- Body: `email`, `password`.
- Respuestas: `200` (token), `400` (credenciales invalidas).

### 3) Notes API (protegida con JWT)

- `POST /notes`
- Descripcion: crea nota.
- Content-Type: `multipart/form-data`.
- Campos: `title`, `content`, `isPrivate`, `password`, `image` (opcional).
- Respuestas: `201`, `400`, `401`.

- `GET /notes`
- Descripcion: lista notas del usuario autenticado.
- Respuestas: `200`, `401`.

- `GET /notes/{id}`
- Descripcion: obtiene una nota por id (con control de ownership/rol).
- Respuestas: `200`, `403`, `404`.

- `PUT /notes/{id}`
- Descripcion: actualiza una nota por id.
- Content-Type: `multipart/form-data`.
- Campos actualizables: `title`, `content`, `isPrivate`, `password`, `image`.
- Respuestas: `200`, `403`, `404`.

- `DELETE /notes/{id}`
- Descripcion: elimina una nota por id.
- Respuestas: `200`, `403`, `404`.

- `POST /notes/{id}/share`
- Descripcion: comparte una nota por email.
- Body JSON: `email`.
- Respuestas: `200`, `400`.

## Estructura de documentacion Swagger

La especificacion OpenAPI se define en:

- `src/infrastructure/config/swagger.config.js`

Las operaciones se documentan junto a sus rutas en:

- `src/presentation/routes/auth.routes.js`
- `src/presentation/routes/note.routes.js`
- `src/presentation/routes/system.routes.js`

## Validaciones aplicadas

Se incorporaron validaciones de entrada por middleware para cumplir separacion de responsabilidades:

- `validateRegister`
- `validateLogin`
- `validateCreateNote`
- `validateShareNote`

Ubicacion:

- `src/presentation/middlewares/validation.middleware.js`
