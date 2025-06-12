import express from "express";
import cors from "cors";
import { database } from "./database.js";
import initModels from "./models/initModels.js";
import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/usuario.js";
import veiculoRoutes from "./routes/veiculo.js";
import relatorioRoutes from './routes/relatorio.js';
import estacionamentoRoutes from './routes/estacionamento.js';
import Estacionamento from './models/estacionamento.js';
import authController from './controllers/authentication_controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/estacionamento', estacionamentoRoutes);
app.use('/relatorio', relatorioRoutes);
app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/veiculo', veiculoRoutes);

initModels();

try {
    await database.authenticate();
    await database.sync({ alter: true });
    const estacionamento = await Estacionamento.findOne();
    if (!estacionamento) {
        await Estacionamento.create({
            vagas: 50,
            vagas_ocupadas: 0
        });
        console.log("Estacionamento inicializado");
    }
    console.log("Banco conectado e sincronizado");
} catch (erro) {
    console.log(erro);
}

app.listen(3000, () => console.log("Servidor iniciado na porta 3000"));
export default app;