import { Router } from "express";
import auth from "../controllers/authentication.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);
router.get('/login', auth.login);
router.post('/cadastro', authorizeRoles('admin'), auth.cadastro);
export default router;