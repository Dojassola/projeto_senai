import Usuario from './usuario.js';
import Veiculo from './veiculo.js';
import Relatorio from './relatorio.js';

const initModels = () => {
  Usuario.hasMany(Veiculo, {
    foreignKey: 'dono_id',
    as: 'veiculosDoUsuario'
  });
  
  Veiculo.belongsTo(Usuario, {
    foreignKey: 'dono_id',
    as: 'dono'
  });

  Veiculo.hasMany(Relatorio, {
    foreignKey: 'veiculo_id',
    as: 'relatorios'
  });
  
  Relatorio.belongsTo(Veiculo, {
    foreignKey: 'veiculo_id',
    as: 'veiculo'
  });
};

export default initModels;