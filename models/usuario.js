import {database} from "../database.js";
import { DataTypes } from "sequelize";

export const Usuario = database.define('usuario', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    senha:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    funcao: {
        type: DataTypes.ENUM('aluno', 'professor', 'funcionario', 'admin'),
        allowNull: false
    }
}, {
    tableName: 'usuario',
    timestamps: false,
});
console.log(Usuario);
export default Usuario;
