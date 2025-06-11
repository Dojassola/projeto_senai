import { database } from "../database.js";
import { DataTypes } from "sequelize";

export const Veiculo = database.define('veiculo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dono_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id'
        }
    }
}, {
    tableName: 'veiculo',
    timestamps: false,
});
console.log(Veiculo)
export default Veiculo;