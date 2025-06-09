import Usuario from './usuario.js';
import Veiculo from './veiculo.js';
import Relatorio from './relatorio.js';

const initModels = () => {
  // User to Vehicle association (one-to-many)
  Usuario.hasMany(Veiculo, {
    foreignKey: 'dono_id',
    as: 'veiculosDoUsuario'  // Changed from 'veiculos' to 'veiculosDoUsuario'
  });
  
  Veiculo.belongsTo(Usuario, {
    foreignKey: 'dono_id',
    as: 'dono'
  });

  // Vehicle to Report association (one-to-many)
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