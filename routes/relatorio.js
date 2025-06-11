import { Router } from 'express';
import * as relatorio_controller from '../controllers/relatorio_controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';
import { verificarVagas } from '../middlewares/verificarvagas.js';
const router = Router();

router.use(verifyToken);

router.get('/', relatorio_controller.listarRelatorios);
router.post('/entrada', authorizeRoles('funcionario', 'admin'),verificarVagas, relatorio_controller.criarEntrada);
router.put('/saida/:id', authorizeRoles('funcionario', 'admin'), relatorio_controller.registrarSaida);

export default router;