import usuario_controller from "../controllers/usuario_controller.js";
import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/auth.js";
import { validateUsuario } from "../middlewares/validate.js";
const router = Router();

router.use(verifyToken);

router.put("/:id", validateUsuario, usuario_controller.updateUsuario);
router.delete("/:id", usuario_controller.deleteUsuario);
router.get("/", usuario_controller.listInfoUsuario);
router.get("/todos", authorizeRoles("admin","funcionario"), usuario_controller.listUsuarios);
router.get("/:id", authorizeRoles("admin","funcionario"), usuario_controller.searchUsuario);
router.post("/", authorizeRoles("admin","funcionario"),validateUsuario, usuario_controller.createUsuario);
export default router;