# Notas API - Documentacion del Backend

## 📖 Documentación disponible

- **[README.md](README.md)** ← Estás aquí (guía técnica completa)
- **[EXPOSICION_CLASE.md](EXPOSICION_CLASE.md)** ← Resumen ejecutivo (2-3 min en clase)
- **[PRINCIPIOS_ARQUITECTURA.md](PRINCIPIOS_ARQUITECTURA.md)** ← Evidencia de principios vistos en clase

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

## Ejemplos de uso (Requests y Responses)

### 1. Registrar usuario

**Request:**
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Juan Perez",
  "email": "juan@email.com",
  "password": "pass123456"
}
```

**Response 201 (Exitoso):**
```json
{
  "message": "User registered successfully"
}
```

**Response 400 (Error):**
```json
{
  "error": "Email already in use"
}
```

### 2. Iniciar sesion (obtener JWT)

**Request:**
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "pass123456"
}
```

**Response 200 (Token obtenido):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImVtYWlsIjoianVhbkBlbWFpbC5jb20iLCJyb2xlIjoidXNlciJ9..."
}
```

### 3. Crear nota (con imagen)

**Request:**
```bash
POST /api/v1/notes
Authorization: Bearer <token>
Content-Type: multipart/form-data

title=Mi nota
content=Contenido de la nota
isPrivate=false
image=<archivo.jpg>
```

**Response 201:**
```json
{
  "id": 1,
  "title": "Mi nota",
  "content": "Contenido de la nota",
  "imageUrl": "/uploads/imagen-123.jpg",
  "isPrivate": false,
  "userId": "abc123",
  "createdAt": "2026-04-29T10:30:00Z",
  "updatedAt": "2026-04-29T10:30:00Z"
}
```

### 4. Obtener notas del usuario

**Request:**
```bash
GET /api/v1/notes
Authorization: Bearer <token>
```

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Mi nota",
    "content": "Contenido de la nota",
    "imageUrl": "/uploads/imagen-123.jpg",
    "isPrivate": false,
    "userId": "abc123",
    "createdAt": "2026-04-29T10:30:00Z",
    "updatedAt": "2026-04-29T10:30:00Z"
  }
]
```

### 5. Compartir nota por email

**Request:**
```bash
POST /api/v1/notes/1/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "destinatario@email.com"
}
```

**Response 200:**
```json
{
  "message": "Note shared successfully"
}
```

### 6. Verificar estado del servicio

**Request:**
```bash
GET /api/health
```

**Response 200:**
```json
{
  "status": "OK",
  "message": "API de notas activa"
}
```

## Testing

### Ejecutar tests

```bash
# Correr todos los tests
npm run test

# Correr tests en modo watch (reejecutar con cada cambio)
npm run test:watch
```

### Cobertura de tests

Se proporcionan dos niveles de testing:

#### 1) Pruebas Unitarias (Unit Tests)

**AuthService** (`src/test/application/auth.service.test.js`)
- ✅ Debe registrar un nuevo usuario (cuando email no existe)
- ✅ Debe lanzar error si el email ya existe

**NoteService** (`src/test/application/note.service.test.js`)
- ✅ Debe crear y guardar una nota correctamente
- ✅ Debe fallar al crear una nota sin título
- ✅ Debe devolver las notas de un usuario especifico

#### 2) Pruebas de Integracion (Integration Tests)

**API Endpoints** (`src/test/integration/api.endpoint.test.js`)
- ✅ GET /api/health → 200 OK (Healthcheck)
- ✅ POST /auth/register sin name → 400 (Validacion de entrada)
- ✅ POST /auth/login sin email/password → 400 (Validacion de entrada)
- ✅ GET /api/v1/notes sin token → 401 (Autenticacion requerida)
- ✅ GET /api/v1/notes con Bearer invalido → 401 (Token invalido)
- ✅ POST /api/v1/notes sin title → 400 (Validacion de entrada)
- ✅ POST /api/v1/notes sin content → 400 (Validacion de entrada)
- ✅ GET /api/v1/notes con token valido → 200 (Lista de notas)
- ✅ GET /api/v1/notes/{id} nota inexistente → 404 (Nota no encontrada)
- ✅ DELETE /api/v1/notes/{id} nota inexistente → 404 (Nota no encontrada)
- ✅ POST /api/v1/notes/{id}/share sin email → 400 (Validacion de entrada)

### Resultado esperado

```
Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        ~5s
```

### Stack de testing

- **Jest**: Framework de testing
- **Supertest**: Agente HTTP para pruebas e2e
- **cross-env**: Variables de entorno multiplataforma (NODE_ENV=test)
