import Veiculo from "../models/veiculo.js";
import Usuario from "../models/usuario.js";
import Relatorio from "../models/relatorio.js";
import { database } from "../database.js";
export const listVeiculos = async (req, res) => {
    const { id } = req;
    try {
        let where = {dono_id: id}
        const veiculos = await Veiculo.findAll({
            where,
            include: [{
                model: Usuario,
                as: 'dono',
                attributes: ['id', 'nome', 'cpf']
            }]
        });
        
        res.status(200).json(veiculos);
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
        res.status(500).json({ message: 'Erro ao buscar veículos', error });
    }
};

export const listTodosVeiculos = async (req, res) => {
    try {
        const veiculos = await Veiculo.findAll({
            include: [{
                model: Usuario,
                as: 'dono',
                attributes: ['id', 'nome', 'cpf']
            }]
        });
        
        res.status(200).json(veiculos);
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
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
    const { placa } = req.body;
    const donoId = req.id;
    const transaction = await database.transaction();
    try {
        if (!placa || !donoId) {
            return res.status(400).json({ message: 'Placa e dono_id são obrigatórios' });
        }
        const veiculoExistente = await Veiculo.findOne({ where: { placa } });
        if (veiculoExistente) {
            return res.status(400).json({ message: 'Já existe um veículo com esta placa' });
        }
        const dono = await Usuario.findByPk(donoId);
        if (!dono) {
            return res.status(404).json({ message: 'Dono não encontrado' });
        }
        const veiculo = await Veiculo.create({ placa, dono_id: donoId });
        const veiculoComDono = await Veiculo.findByPk(veiculo.id, {
            include: [{
                model: Usuario,
                as: 'dono',
                attributes: ['id', 'nome', 'cpf']
            }]
        });
        await transaction.commit();
        res.status(201).json(veiculoComDono);
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao criar veículo:', error);
        res.status(500).json({ message: 'Erro ao criar veículo', error });
    }
};

export const createVeiculoById = async (req, res) => {
    const { placa } = req.body;
    const { id } = req.params;
    const transaction = await database.transaction();
    try {
        if (!placa || !id) {
            return res.status(400).json({ message: 'Placa e dono_id são obrigatórios' });
        }

        const veiculoExistente = await Veiculo.findOne({ where: { placa } });
        if (veiculoExistente) {
            return res.status(400).json({ message: 'Já existe um veículo com esta placa' });
        }

        const dono = await Usuario.findByPk(id);
        if (!dono) {
            return res.status(404).json({ message: 'Dono não encontrado' });
        }

        const veiculo = await Veiculo.create({ placa, dono_id: id });

        const veiculoComDono = await Veiculo.findByPk(veiculo.id, {
            include: [{
                model: Usuario,
                as: 'dono',
                attributes: ['id', 'nome', 'cpf']
            }]
        });
        await transaction.commit();
        res.status(201).json(veiculoComDono);
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao criar veículo:', error);
        res.status(500).json({ message: 'Erro ao criar veículo', error });
    }
};

export const updateVeiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, donoId } = req.body;
    const transaction = await database.transaction();
    try {
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        veiculo.placa = placa;
        if (donoId) {
            const dono = await Usuario.findByPk(donoId);
            if (!dono) {
                return res.status(404).json({ message: 'Dono não encontrado' });
            }
            veiculo.dono_id = donoId;
        }
        await veiculo.save();
        await transaction.commit();
        const veiculoAtualizado = await Veiculo.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'dono',
                attributes: ['id', 'nome', 'cpf']
            }]
        });

        res.status(200).json(veiculoAtualizado);
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao atualizar veículo:', error);
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

        await veiculo.destroy({ transaction });
        
        await transaction.commit();
        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
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
    deleteVeiculo,
    createVeiculoById,
    listTodosVeiculos
};