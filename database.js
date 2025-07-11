import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database = new Sequelize(process.env.DATABASE_URL,{
  dialect: 'postgres',
  protocol: 'postgres',
  logging: true
});

try {
    await database.authenticate();
    console.log('Conectado com sucesso');
} catch (erro) {
    console.log('Erro na conexão:', erro);
}

export { database };