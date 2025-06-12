import { Router } from "express";
import veiculo_controller from "../controllers/veiculo_controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { validateVeiculo, verificarVagas } from "../middlewares/validate.js";
const router = Router();

router.use(verifyToken);

router.get("/", veiculo_controller.listVeiculos);
router.get("/todos", authorizeRoles('admin', 'funcionario'), veiculo_controller.listTodosVeiculos);
router.get("/:id", authorizeRoles('admin', 'funcionario'), veiculo_controller.searchVeiculo);
router.post("/", authorizeRoles('admin','funcionario'), verificarVagas, validateVeiculo, veiculo_controller.createVeiculo);
router.post("/:id", authorizeRoles('admin','funcionario'), verificarVagas, validateVeiculo, veiculo_controller.createVeiculoById);
router.put("/:id", authorizeRoles('admin','funcionario'), veiculo_controller.updateVeiculo);
router.delete("/:id", authorizeRoles('admin','funcionario'), veiculo_controller.deleteVeiculo);

export default router;