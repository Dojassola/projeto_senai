import Relatorio from '../models/relatorio.js';
import Veiculo from '../models/veiculo.js';

export const criarEntrada = async (req, res) => {
    const { veiculo_id } = req.body;
    try {
        const veiculo = await Veiculo.findByPk(veiculo_id);
        if (!veiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado' });
        }

        const relatorio = await Relatorio.create({
            veiculo_id,
            entrada: new Date(),
        });

        res.status(201).json(relatorio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar entrada', error });
    }
};

export const registrarSaida = async (req, res) => {
    const { id } = req.params;
    try {
        const relatorio = await Relatorio.findByPk(id);
        if (!relatorio) {
            return res.status(404).json({ message: 'Relatório não encontrado' });
        }

        relatorio.saida = new Date();
        await relatorio.save();

        res.status(200).json(relatorio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar saída', error });
    }
};

export const listarRelatorios = async (req, res) => {
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
        res.status(500).json({ message: 'Erro ao listar relatórios', error });
    }
};
export default {
    criarEntrada,
    registrarSaida,
    listarRelatorios
};