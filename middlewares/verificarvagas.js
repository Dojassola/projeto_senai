import Estacionamento from '../models/estacionamento.js';

export const verificarVagas = async (req, res, next) => {
    try {
        const estacionamento = await Estacionamento.findByPk(1);
        if (!estacionamento) {
            return res.status(404).json({ message: 'Estacionamento não configurado' });
        }
        if (estacionamento.vagas_ocupadas >= estacionamento.total_vagas) {
            return res.status(409).json({ message: 'Estacionamento lotado' });
        }
        req.estacionamento = estacionamento;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar vagas', error });
    }
};
export default verificarVagas