import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import JwtService from '../../infrastructure/security/jwt.service.js';
import sequelize from '../../infrastructure/database/mysql/connection.js';
 
describe('Integración - API Completa', () => {
   
    // Si estuviéramos usando una base de datos real de pruebas, aquí nos desconectaríamos al finalizar
    afterAll(async () => {
        await Promise.allSettled([
            mongoose.disconnect(),
            sequelize.close(),
        ]);
    });
 
    describe('1. System - Healthcheck Endpoint', () => {
        test('GET /api/health debería devolver 200 OK y estado', async () => {
            const response = await request(app).get('/api/health');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('2. Auth API - Registro y Login', () => {
        test('POST /auth/register debería fallar sin name', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ email: 'test@test.com', password: 'pass123' });
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('POST /auth/login debería fallar sin email o password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@test.com' });
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
 
    describe('3. Notes API - Autenticacion (JWT)', () => {
        let validToken;
 
        // Generar token valido para las pruebas de notas
        beforeAll(() => {
            validToken = JwtService.generateToken({
                id: 'usuario_falso_123',
                email: 'test@test.com',
                role: 'user'
            });
        });
 
        test('GET /notes debería fallar sin Token (401)', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        test('GET /notes debería fallar con Bearer invalido (401)', async () => {
            const response = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', 'Bearer token_invalido');
            
            expect(response.statusCode).toBe(401);
        });
 
        test('POST /notes debería fallar sin title (400)', async () => {
            const response = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ content: 'Contenido sin titulo' });
           
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        test('POST /notes debería fallar sin content (400)', async () => {
            const response = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ title: 'Titulo sin contenido' });
           
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
 
        test('GET /notes con Token valido debería retornar array (200)', async () => {
            const response = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`);
           
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('GET /notes/{id} deberia fallar si la nota no existe (404)', async () => {
            const response = await request(app)
                .get('/api/v1/notes/9999')
                .set('Authorization', `Bearer ${validToken}`);
           
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        test('DELETE /notes/{id} deberia fallar si la nota no existe (404)', async () => {
            const response = await request(app)
                .delete('/api/v1/notes/9999')
                .set('Authorization', `Bearer ${validToken}`);
           
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error');
        });

        test('POST /notes/{id}/share deberia fallar sin email (400)', async () => {
            const response = await request(app)
                .post('/api/v1/notes/1/share')
                .set('Authorization', `Bearer ${validToken}`)
                .send({});
           
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });
});
 