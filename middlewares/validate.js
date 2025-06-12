import { check, validationResult } from 'express-validator';
import Estacionamento from '../models/estacionamento.js';
export const validateEstacionamento = [
    check('vagas')
        .isInt({ min: 1 })
        .withMessage('O número de vagas deve ser maior que 0'),
    check('vagas_ocupadas')
        .isInt({ min: 0 })
        .withMessage('O número de vagas ocupadas não pode ser negativo'),
    handleValidationErrors
];

export const validateVeiculo = [
    check('placa')
        .matches(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/)
        .withMessage('Placa inválida - formato: ABC1234'),
    handleValidationErrors
];

export const validateUsuario = [
    check('nome')
        .isLength({ min: 3 })
        .withMessage('Nome deve ter no mínimo 3 caracteres'),
    check('cpf')
        .custom((value) => {
            const cpf = value.replace(/\D/g, '');
            if (cpf.length !== 11) {
                throw new Error('CPF deve conter 11 dígitos');
            }
            let sum = 0;
            let remainder;

            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cpf[i - 1]) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf[9])) {
                throw new Error('CPF inválido');
            }

            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cpf[i - 1]) * (12 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf[10])) {
                throw new Error('CPF inválido');
            }

            return true;
        })
        .withMessage('CPF inválido'),
    check('senha')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres'),
    check('funcao')
        .isIn(['aluno', 'professor', 'funcionario', 'admin'])
        .withMessage('Função inválida'),
    handleValidationErrors
];

export const validateLogin = [
    check('cpf')
        .custom((value) => {
            const cpf = value.replace(/\D/g, '');
            if (cpf.length !== 11) {
                throw new Error('CPF deve conter 11 dígitos');
            }
            return true;
        })
        .withMessage('CPF inválido'),
    handleValidationErrors
];

export const validateRelatorio = [
    check('veiculo_id')
        .isInt()
        .withMessage('ID do veículo inválido'),
    check('entrada')
        .optional()
        .isISO8601()
        .withMessage('Data de entrada inválida'),
    check('saida')
        .optional()
        .isISO8601()
        .withMessage('Data de saída inválida'),
    handleValidationErrors
];

export const verificarVagas = async (req, res, next) => {
    try {
        const estacionamento = await Estacionamento.findByPk(1);
        if (!estacionamento) {
            return res.status(404).json({ message: 'Estacionamento não configurado' });
        }
        req.estacionamento = estacionamento;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar vagas', error });
    }
};

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
export default {
    validateEstacionamento,
    validateVeiculo,
    validateUsuario,
    validateRelatorio,
    verificarVagas
};