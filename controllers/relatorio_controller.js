import Relatorio from '../models/relatorio.js';
import Veiculo from '../models/veiculo.js';
import { database } from "../database.js";

export const criarEntrada = async (req, res) => {
    const { veiculo_id } = req.body;
    const transaction = await database.transaction();
    try {
        const veiculo = await Veiculo.findByPk(veiculo_id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }
        const estacionamento = req.estacionamento;
        if (!estacionamento) {
            return res.status(404).json({ message: 'Estacionamento não configurado' });
        }
        const relatorio = await Relatorio.create({
            veiculo_id,
            entrada: new Date(),
        });
        estacionamento.vagas_ocupadas += 1;
        await estacionamento.save({ transaction });
        await transaction.commit();
        res.status(201).json({
            relatorio,
            estacionamento: {
                vagas_totais: estacionamento.total_vagas,
                vagas_ocupadas: estacionamento.vagas_ocupadas
            }
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao registrar entrada', error });
    }
};

export const criarEntradaPorPlaca = async (req, res) => {
    const { placa } = req.body;
    try {
        const veiculo = await Veiculo.findOne({ where: { placa } });
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        const relatorio = await Relatorio.create({
            veiculo_id: veiculo.id,
            entrada: new Date(),
        });

        res.status(201).json(relatorio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar entrada por placa', error });
    }
};

export const registrarSaida = async (req, res) => {
    const { id } = req.params;
    try {
        const relatorio = await Relatorio.findByPk(id, {
            include: [{
                model: Veiculo,
                as: 'veiculo',
                attributes: ['placa']
            }]
        });

        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado' });
        }

        if (relatorio.saida) {
            return res.status(400).json({ message: 'Saída já registrada para este relatório' });
        }

        const tempoEstadia = new Date() - new Date(relatorio.entrada);
        relatorio.saida = new Date();
        await relatorio.save();

        res.status(200).json({
            ...relatorio.toJSON(),
            tempoEstadia: `${Math.floor(tempoEstadia / (1000 * 60))} minutos`
        });
    } catch (error) {
        console.error('Erro ao registrar saída:', error);
        res.status(500).json({ message: 'Erro ao registrar saída', error });
    }
};
export const listarRelatorios = async (req, res) => {
    const usuarioId = req.id;
    if (!usuarioId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    try {
        const usuario = await Usuario.findByPk(usuarioId, {
            include: [{
                model: Veiculo,
                as: 'veiculos',
                attributes: ['id']
            }]
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const veiculoIds = usuario.veiculos.map(veiculo => veiculo.id);

        const relatorios = await Relatorio.findAll({
            where: {
                veiculo_id: veiculoIds
            },
            include: [{
                model: Veiculo,
                as: 'veiculo',
                attributes: ['placa']
            }]
        });

        res.status(200).json(relatorios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar relatórios', error });
    }
};
export default {
    criarEntrada,
    registrarSaida,
    listarRelatorios,
    criarEntradaPorPlaca
};