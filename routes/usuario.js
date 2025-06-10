import usuario_controller from "../controllers/usuario_controller.js";
import { Router } from "express";
import { authorizeRoles } from "../middlewares/auth.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

router.put("/:id", usuario_controller.updateUsuario);
router.delete("/:id", usuario_controller.deleteUsuario);

router.use(verifyToken);
router.get("/", authorizeRoles("admin","funcionario"), usuario_controller.listUsuarios);
router.get("/:id", authorizeRoles("admin","funcionario"), usuario_controller.searchUsuario);
router.post("/",authorizeRoles("admin","funcionario"), usuario_controller.createUsuario);
export default router;