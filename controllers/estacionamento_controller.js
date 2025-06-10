import Estacionamento from "../models/estacionamento";

export const listEstacionamentos = async (req, res) => {
    try {
        const estacionamentos = await Estacionamento.findAll();
        res.status(200).json(estacionamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estacionamentos', error });
    }
};

export const getVagasDisponiveis = async (req, res) => {
    const { id } = req.params;
    try {
        const estacionamento = await Estacionamento.findByPk(id);
        if (!estacionamento) {
            return res.status(404).json({ message: 'Estacionamento não encontrado' });
        }
        const vagasDisponiveis = estacionamento.total_vagas - estacionamento.vagas_ocupadas;
        res.status(200).json({ vagasDisponiveis });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar vagas disponíveis', error });
    }
};

export const searchEstacionamento = async (req, res) => {
    const { id } = req.params;
    try {
        const estacionamento = await Estacionamento.findByPk(id);
        if (!estacionamento) {
            return res.status(404).json({ message: 'Estacionamento não encontrado' });
        }
        res.status(200).json(estacionamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estacionamento', error });
    }
};

export const createEstacionamento = async (req, res) => {
    const { total_vagas } = req.body;
    try {
        const estacionamento = await Estacionamento.create({ total_vagas, vagas_ocupadas: 0 });
        res.status(201).json(estacionamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar estacionamento', error });
    }
};
export default {
    listEstacionamentos,
    getVagasDisponiveis,
    searchEstacionamento,
    createEstacionamento,
    checkVagasPublic
};