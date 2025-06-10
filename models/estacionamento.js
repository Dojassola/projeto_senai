import { database } from "../database.js";
import { DataTypes } from "sequelize";

export const Estacionamento = database.define('relatorio', {
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
    },
    status: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.vagas_ocupadas >= this.total_vagas ? 'LOTADO' : 'DISPONÍVEL';
        }
    }
}, {
    tableName: 'estacionamento',
    timestamps: false,
});

export default Estacionamento;