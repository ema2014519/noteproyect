import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Endpoints tecnicos del sistema
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado de la API
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API operativa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: API de notas activa
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API de notas activa' });
});

export default router;