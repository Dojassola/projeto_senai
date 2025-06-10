import { Router } from "express";
import auth from "../controllers/authentication_controller.js";
import { verifyToken,authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.post('/login', auth.login);
router.use(verifyToken);
router.post('/cadastro', authorizeRoles("admin"), auth.cadastro);
export default router;