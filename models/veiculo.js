import { database } from "../database";
import { DataTypes } from "sequelize";
import Usuario from "./usuario";

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
Veiculo.belongsTo(Usuario, {
    foreignKey: 'dono_id',
    as: 'dono'
});
Usuario.hasMany(Veiculo, {
    foreignKey: 'dono_id',
    as: 'veiculos'
});
console.log(Veiculo)
export default Veiculo;