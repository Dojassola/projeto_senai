import { database } from "../database.js";
import { DataTypes } from "sequelize";
export const Relatorio = database.define('relatorio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    veiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'veiculo',
          key: 'id'
        }
    },
    entrada: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    saida: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'relatorio',
    timestamps: false,
});
export default Relatorio;