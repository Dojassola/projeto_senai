import Relatorio from '../models/relatorio.js';
import Veiculo from '../models/veiculo.js';
import { database } from "../database.js";
import Usuario from '../models/usuario.js';
export const criarEntrada = async (req, res) => {
    const { veiculo_id, placa } = req.body;
    const transaction = await database.transaction();
    try {
        let veiculo;
        if (veiculo_id) {
            veiculo = await Veiculo.findByPk(veiculo_id);
        } else if (placa) {
            veiculo = await Veiculo.findOne({ where: { placa } });
        }else{
            return res.status(400).json({ message: 'ID do veículo ou placa é obrigatório' });
        }

        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        const estacionamento = req.estacionamento;
        if (estacionamento.vagas_ocupadas >= estacionamento.total_vagas) {
            return res.status(409).json({ message: 'Estacionamento lotado' });
        }

        const relatorioAberto = await Relatorio.findOne({
            where: {
                veiculo_id: veiculo.id,
                saida: null
            }
        });

        if (relatorioAberto) {
            return res.status(400).json({ message: 'Veículo já está no estacionamento' });
        }

        const relatorio = await Relatorio.create({
            veiculo_id: veiculo.id,
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
    const transaction = await database.transaction();
    try {
        const relatorio = await Relatorio.findOne({
            where: {
                veiculo_id: id,
                saida: null
            },
            include: [{
                model: Veiculo,
                as: 'veiculo',
                attributes: ['placa']
            }]
        });

        if (!relatorio) {
            return res.status(404).json({ message: 'Nenhuma entrada em aberto encontrada para este veículo' });
        }
        const estacionamento = req.estacionamento;
        if (estacionamento.vagas_ocupadas <= 0) {
            estacionamento.vagas_ocupadas = 0;
            await estacionamento.save({ transaction });
            return res.status(409).json({ message: 'Alguem passou a catraca sem passar pelo sistema' });
        }

        const tempoEstadia = new Date() - new Date(relatorio.entrada);
        relatorio.saida = new Date();
        estacionamento.vagas_ocupadas -= 1;
        await estacionamento.save({ transaction });
        await relatorio.save();

        await transaction.commit();
        res.status(200).json({
            ...relatorio.toJSON(),
            tempoEstadia: `${Math.floor(tempoEstadia / (1000 * 60))} minutos`
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao registrar saída', error });
    }
};

export const deletarRelatorio = async (req, res) => {
    const { id } = req.params;
    const transaction = await database.transaction();
    try {
        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado' });
        }
        if (relatorio.saida === null) {
            return res.status(400).json({ message: 'Não é possível deletar um relatório com entrada aberta' });
        }
        await relatorio.destroy();
        transaction.commit();
        res.status(204).send();
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao deletar relatório:', error);
        res.status(500).json({ message: 'Erro ao deletar relatório', error });
    }
}

export const atualizarRelatorio = async (req, res) => {
    const { id } = req.params;
    const { entrada, saida } = req.body;
    const transaction = await database.transaction();
    try {
        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado' });
        }

        if (entrada) {
            relatorio.entrada = new Date(entrada);
        }
        if (saida) {
            relatorio.saida = new Date(saida);
        }

        await relatorio.save();
        await transaction.commit();
        res.status(200).json(relatorio);
    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao atualizar relatório:', error);
        res.status(500).json({ message: 'Erro ao atualizar relatório', error });
    }
}

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
export const listarTodosOsRelatorios = async (req, res) => {
    try {
        const relatorios = await Relatorio.findAll({
            include: [{
                model: Veiculo,
                as: 'veiculo',
                attributes: ['placa']
            }]
        });

        res.status(200).json(relatorios);
    } catch (error) {
        console.error('Erro ao listar todos os relatórios:', error);
        res.status(500).json({ message: 'Erro ao listar relatórios', error });
    }
};
export default {
    criarEntrada,
    registrarSaida,
    listarRelatorios,
    criarEntradaPorPlaca,
    listarTodosOsRelatorios,
    deletarRelatorio,
    atualizarRelatorio
};