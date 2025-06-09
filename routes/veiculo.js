import { Router } from "express";
import veiculo_controller from "../controllers/veiculo_controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/", authorizeRoles('admin', 'funcionario'), veiculo_controller.listVeiculos);
router.get("/:id", authorizeRoles('admin', 'funcionario'), veiculo_controller.searchVeiculo);
router.post("/", authorizeRoles('admin'), veiculo_controller.createVeiculo);
router.put("/:id", authorizeRoles('admin'), veiculo_controller.updateVeiculo);
router.delete("/:id", authorizeRoles('admin'), veiculo_controller.deleteVeiculo);

export default router;