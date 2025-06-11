import { Router } from "express";
import * as estacionamento_controller from "../controllers/estacionamento_controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.use(verifyToken);

router.get("/", estacionamento_controller.listEstacionamentos);
router.get("/vagas/:id", estacionamento_controller.getVagasDisponiveis);
router.get("/:id", authorizeRoles('admin', 'funcionario'), estacionamento_controller.searchEstacionamento);
router.post("/", authorizeRoles('admin'), estacionamento_controller.createEstacionamento);
router.put("/:id", authorizeRoles('admin', 'funcionario'), estacionamento_controller.updateVagas);

export default router;