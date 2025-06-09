import usuario_controller from "../controllers/usuario_controller";
import { Router } from "express";
const router = Router();
// rotas para o usuario
router.get("/", usuario_controller.listUsuarios);
router.get("/:id", usuario_controller.searchUsuario);
router.post("/", usuario_controller.createUsuario);
router.put("/:id", usuario_controller.updateUsuario);
router.delete("/:id", usuario_controller.deleteUsuario);

export default router;