import { database } from "../database.js";
import { DataTypes } from "sequelize";

export const Estacionamento = database.define('estacionamento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    vagas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vagas_ocupadas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'estacionamento',
    timestamps: false,
});

export default Estacionamento;