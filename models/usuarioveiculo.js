import { DataTypes } from 'sequelize';
import { database } from '../database.js';

const UsuarioVeiculo = database.define('usuario_veiculo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_relacao: {
        type: DataTypes.ENUM('proprietario', 'autorizado'),
        defaultValue: 'autorizado'
    }
}, {
    tableName: 'usuario_veiculo',
    timestamps: true
});

export default UsuarioVeiculo;  