import { Router } from "express";

import NodeController from "../controllers/node.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();
const noteController = new NodeController();

//definir las rutas para las notas
router.post("/notes", upload.single('image'), noteController.createNode);
router.get("/notes", noteController.getNotesbyUserId);
 
export default router;