import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesGlob = path.join(__dirname, '../../presentation/routes/*.js').replace(/\\/g, '/');

const createSwaggerSpec = (port) => swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Notas Personales',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar notas y usuarios',
        },
        servers: [
            { url: `http://localhost:${port}/api/v1` },
            { url: `http://localhost:${port}/api` }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            },
            schemas: {
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Juan Perez' },
                        email: { type: 'string', format: 'email', example: 'juan@email.com' },
                        password: { type: 'string', minLength: 6, example: '123456' }
                    }
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'juan@email.com' },
                        password: { type: 'string', example: '123456' }
                    }
                },
                CreateNoteRequest: {
                    type: 'object',
                    required: ['title', 'content'],
                    properties: {
                        title: { type: 'string', example: 'Recordatorio' },
                        content: { type: 'string', example: 'Estudiar arquitectura limpia' },
                        isPrivate: { type: 'boolean', example: false },
                        password: { type: 'string', nullable: true, example: '' }
                    }
                },
                CreateNoteMultipartRequest: {
                    type: 'object',
                    required: ['title', 'content'],
                    properties: {
                        title: { type: 'string', example: 'Recordatorio' },
                        content: { type: 'string', example: 'Estudiar arquitectura limpia' },
                        isPrivate: { type: 'boolean', example: false },
                        password: { type: 'string', nullable: true, example: '' },
                        image: { type: 'string', format: 'binary' }
                    }
                },
                UpdateNoteRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', example: 'Nota actualizada' },
                        content: { type: 'string', example: 'Nuevo contenido' },
                        isPrivate: { type: 'boolean', example: true },
                        password: { type: 'string', nullable: true, example: 'pass123' }
                    }
                },
                UpdateNoteMultipartRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', example: 'Nota actualizada' },
                        content: { type: 'string', example: 'Nuevo contenido' },
                        isPrivate: { type: 'boolean', example: true },
                        password: { type: 'string', nullable: true, example: 'pass123' },
                        image: { type: 'string', format: 'binary' }
                    }
                },
                ShareNoteRequest: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'destino@email.com' }
                    }
                },
                Note: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Recordatorio' },
                        content: { type: 'string', example: 'Terminar proyecto final' },
                        imageUrl: { type: 'string', nullable: true, example: '/uploads/imagen-123.jpg' },
                        isPrivate: { type: 'boolean', example: false },
                        userId: { type: 'string', example: 'abc123' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                AuthTokenResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Operation completed successfully' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Validation error' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [routesGlob],
});

export const setupSwagger = (app, port) => {
    const swaggerSpec = createSwaggerSpec(port);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📄 Documentación Swagger disponible en http://localhost:${port}/api-docs`);
};