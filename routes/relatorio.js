import { Router } from 'express';
import * as relatorio_controller from '../controllers/relatorio_controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';
import { verificarVagas } from '../middlewares/validate.js';
const router = Router();

router.use(verifyToken);

router.get('/', relatorio_controller.listarRelatorios);
router.get('/todos', authorizeRoles('admin','funcionario'), relatorio_controller.listarTodosOsRelatorios);
router.post('/entrada', authorizeRoles('funcionario', 'admin'),verificarVagas, relatorio_controller.criarEntrada);
router.put('/saida/:id', authorizeRoles('funcionario', 'admin'),verificarVagas, relatorio_controller.registrarSaida);
router.put('/:id', authorizeRoles('funcionario', 'admin'),verificarVagas, relatorio_controller.atualizarRelatorio);
router.delete('/:id', authorizeRoles('admin', 'funcionario'), relatorio_controller.deletarRelatorio);
export default router;