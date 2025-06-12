import { Router } from "express";
import auth from "../controllers/authentication_controller.js";
const router = Router();

router.post('/login', auth.login);
router.post('/cadastro', auth.cadastro);
export default router;