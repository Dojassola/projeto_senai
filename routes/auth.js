import { Router } from "express";
import auth from "../controllers/authentication_controller.js";
import { validateUsuario, validateLogin } from "../middlewares/validate.js";
import { verifyToken } from "../middlewares/auth.js"; 
const router = Router();

router.post('/login',validateLogin, auth.login);
router.use(verifyToken)
router.post('/cadastro',validateUsuario, auth.cadastro);
export default router;