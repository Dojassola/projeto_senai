import Veiculo from "../models/veiculo.js";
import Usuario from "../models/usuario.js";
import UsuarioVeiculo from "../models/usuarioveiculo.js";
import Relatorio from "../models/relatorio.js";
import { database } from "../database.js";
export const listVeiculos = async (req, res) => {
    const { id, usuarioFuncao } = req;
    console.log(id,usuarioFuncao);
    const usuarioId = usuarioFuncao === 'admin' || usuarioFuncao === 'funcionario' ? id : null;
    try {
        if (!usuarioId) {
            const veiculos = await Veiculo.findAll({
                include: [{
                    model: Usuario,
                    as: 'dono'
                }]
            });
            res.status(200).json(veiculos);
        }
        else{
            const veiculos = await Veiculo.findAll({
                include: [{
                    model: Usuario,
                    as: 'dono',
                    where: { id: usuarioId }
                }]
            });
            res.status(200).json(veiculos);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículos', error });
    }
};

export const searchVeiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const veiculo = await Veiculo.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'dono'
            }]
        });
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar veículo', error });
    }
};

export const createVeiculo = async (req, res) => {
    const { placa, usuarios } = req.body;
    try {
        const veiculo = await Veiculo.create({ placa });
        
        if (usuarios && usuarios.length > 0) {
            await Promise.all(usuarios.map(user => 
                UsuarioVeiculo.create({
                    usuario_id: user.id,
                    veiculo_id: veiculo.id,
                    tipo_relacao: user.tipo
                })
            ));
        }

        const veiculoComUsuarios = await Veiculo.findByPk(veiculo.id, {
            include: [{
                model: Usuario,
                as: 'usuarios',
                through: { attributes: ['tipo_relacao'] }
            }]
        });

        res.status(201).json(veiculoComUsuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar veículo', error });
    }
};

export const updateVeiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, usuarios } = req.body;
    try {
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        veiculo.placa = placa;
        await veiculo.save();

        if (usuarios && usuarios.length > 0) {
            await UsuarioVeiculo.destroy({
                where: { veiculo_id: id }
            });

            await Promise.all(usuarios.map(user => 
                UsuarioVeiculo.create({
                    usuario_id: user.id,
                    veiculo_id: id,
                    tipo_relacao: user.tipo
                })
            ));
        }

        const veiculoAtualizado = await Veiculo.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'usuarios',
                through: { attributes: ['tipo_relacao'] }
            }]
        });

        res.status(200).json(veiculoAtualizado);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo', error });
    }
};

export const deleteVeiculo = async (req, res) => {
    const { id } = req.params;
    const transaction = await database.transaction();

    try {
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        await UsuarioVeiculo.destroy({
            where: { veiculo_id: id },
            transaction
        });

        await Relatorio.destroy({
            where: { veiculo_id: id },
            transaction
        });

        await veiculo.destroy({ transaction });
        
        await transaction.commit();
        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao deletar veículo:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar veículo e seus relacionamentos', 
            error 
        });
    }
};
export default {
    listVeiculos,
    searchVeiculo,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo
};