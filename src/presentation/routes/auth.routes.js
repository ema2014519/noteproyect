import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import AuthService from '../../application/use-cases/auth.service.js';
import UserMongoRepository from '../../infrastructure/database/mongo/user.mongo.repository.js';
import { validateLogin, validateRegister } from '../middlewares/validation.middleware.js';

const router = Router();

const userRepository = new UserMongoRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController({ authService });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticacion de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Datos invalidos o email en uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', validateRegister, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesion y obtener JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokenResponse'
 *       400:
 *         description: Credenciales faltantes o invalidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateLogin, authController.login);

export default router;
