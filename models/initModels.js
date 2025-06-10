import Usuario from './usuario.js';
import Veiculo from './veiculo.js';
import Relatorio from './relatorio.js';
import UsuarioVeiculo from './usuarioveiculo.js';
const initModels = () => {
  Usuario.belongsToMany(Veiculo, {
    through: UsuarioVeiculo,
    foreignKey: 'usuario_id',
    as: 'veiculos'
});

Veiculo.belongsToMany(Usuario, {
    through: UsuarioVeiculo,
    foreignKey: 'veiculo_id',
    as: 'usuarios'
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