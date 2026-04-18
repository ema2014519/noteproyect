import { Router } from "express";

import NodeController from "../controllers/node.controller.js";
import upload from "../middlewares/upload.middleware.js";
import NoteService from "../../application/use-cases/note.service.js";
import NoteMongoRepository from "../../infraestructure/database/mongo/note.mongo.repository.js";

const router = Router();
const noteRepository = new NoteMongoRepository();
const noteService = new NoteService(noteRepository);
const noteController = new NodeController(noteService);

//definir las rutas para las notas
router.post("/notes", upload.single('image'), noteController.createNode);
router.get("/notes", noteController.getNotesbyUserId);
 
export default router;