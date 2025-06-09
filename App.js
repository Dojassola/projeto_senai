import express from "express";
import cors from "cors";
import { database } from "./database.js";
import initModels from "./models/initModels.js";
import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/usuario.js";
import veiculoRoutes from "./routes/veiculo.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/veiculo', veiculoRoutes);

// Initialize models and database
initModels();

try {
    await database.authenticate();
    await database.sync({ alter: true });
    console.log("Banco conectado e sincronizado");
} catch (erro) {
    console.log(erro);
}

app.listen(3000, () => console.log("Servidor iniciado na porta 3000"));