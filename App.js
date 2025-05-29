import express from "express";
import cors from "express";
import { database } from "./database";
import initModels from "./models/initModels";



const app = express();
app.use(cors());
app.use(express.json());
initModels();
try{
    await database.authenticate();
    await database.sync({ alter: true });
    console.log("Banco conectado e sincronizado");
}catch (erro) {
    console.log(erro);
}
app.listen(3000, () => console.log("Servidor iniciado na porta 3000"));
