import Veiculo from "../models/veiculo.js";
import Usuario from "../models/usuario.js";

export const listVeiculos = async (req, res) => {
    try {
        const veiculos = await Veiculo.findAll({
            include: [{
                model: Usuario,
                as: 'dono'
            }]
        });
        res.status(200).json(veiculos);
    } catch (error) {
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
    const { placa, dono_id } = req.body;
    try {
        const novoVeiculo = await Veiculo.create({ placa, dono_id });
        res.status(201).json(novoVeiculo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar veículo', error });
    }
};

export const updateVeiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, dono_id } = req.body;
    try {
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        veiculo.placa = placa;
        veiculo.dono_id = dono_id;
        await veiculo.save();
        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar veículo', error });
    }
};

export const deleteVeiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        await veiculo.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar veículo', error });
    }
};

export default {
    listVeiculos,
    searchVeiculo,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo
};