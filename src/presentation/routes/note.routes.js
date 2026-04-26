import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Importamos el repositorio de MySQL y el servicio de Mail
import NoteMySQLRepository from "../../infrastructure/database/mysql/note.mysql.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

// Inyección de dependencias
const mailService = new MailService();
const noteRepository = new NoteMySQLRepository();
const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

// Definir las rutas para las notas
/*
 * @swagger
 * /notes:
 * get:
 * summary: Obtener todas las notas del usuario autenticado
 * tags: [Notes]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de notas obtenida exitosamente
 * 401:
 * description: No autorizado, token faltante o inválido
 */
router.post("/", authMiddleware, upload.single('image'), noteController.createNote);
router.get("/", authMiddleware, noteController.getNotesByUserId);
router.get("/:id", authMiddleware, noteController.getNoteById);
router.put("/:id", authMiddleware, upload.single('image'), noteController.updateNote);
router.delete("/:id", authMiddleware, noteController.deleteNote);
router.post("/:id/share", authMiddleware, noteController.shareNote);

export default router;