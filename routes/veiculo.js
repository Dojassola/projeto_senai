import { Router } from "express";
import veiculo_controller from "../controllers/veiculo_controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { verificarVagas } from "../middlewares/verificarvagas.js";
import { validateVeiculo } from "../middlewares/validate.js";
const router = Router();

router.use(verifyToken);

router.get("/", veiculo_controller.listVeiculos);
router.get("/:id", authorizeRoles('admin', 'funcionario'), veiculo_controller.searchVeiculo);
router.post("/", authorizeRoles('admin','funcionario'), verificarVagas, validateVeiculo, veiculo_controller.createVeiculo);
router.put("/:id", authorizeRoles('admin','funcionario'), veiculo_controller.updateVeiculo);
router.delete("/:id", authorizeRoles('admin','funcionario'), veiculo_controller.deleteVeiculo);

export default router;