import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";
import { database } from "../database.js";
import { Op } from "sequelize";

export const listUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['senha'] }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
}

export const listInfoUsuario = async (req, res) => {
    const { id } = req;
    try {
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
}
export const searchUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (usuario.funcao === 'funcionario') {
            usuario.senha = undefined; 
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
}

export const createUsuario = async (req, res) => {
    const { nome, cpf, senha, funcao } = req.body;
    if (!nome || !cpf || !senha || !funcao) {
        return res.status(400).json({ 
            message: 'Nome, CPF, senha e função são obrigatórios' 
        });
    }
    const transaction = await database.transaction();
    try {
        if (req.usuarioFuncao === 'funcionario' && 
            !['aluno', 'professor'].includes(funcao)) {
            return res.status(403).json({ 
                message: 'Função inválida' 
            });
        }
        const existingUsuario = await Usuario.findOne({ where: { cpf } });
        if (existingUsuario) {
            return res.status(400).json({ 
                message: 'Já existe um usuário com este CPF' 
            });
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        const usuario = await Usuario.create({
            nome,
            cpf,
            senha: hashSenha,
            funcao
        });
        await transaction.commit();
        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            funcao: usuario.funcao
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
};

export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, senha, cpf, funcao } = req.body;
    const transaction = await database.transaction();
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (req.usuarioFuncao === 'funcionario') {
            if (usuario.funcao === 'admin' || funcao === 'admin') {
                return res.status(403).json({ 
                    message: 'Funcionários não podem modificar administradores' 
                });
            }
            if (!['aluno', 'professor'].includes(funcao)) {
                return res.status(403).json({ 
                    message: 'Funcionários só podem atualizar alunos e professores' 
                });
            }
        }
        if (cpf) {
            const existingUsuario = await Usuario.findOne({ where: { cpf, id: { [Op.ne]: id } } });
            if (existingUsuario) {
                return res.status(400).json({ 
                    message: 'Já existe um usuário com este CPF' 
                });
            }
        }
        usuario.nome = nome || usuario.nome;
        usuario.cpf = cpf || usuario.cpf;
        
        if (senha) {
            usuario.senha = await bcrypt.hash(senha, 10);
        }
        
        if (funcao) {
            usuario.funcao = funcao;
        }

        await usuario.save();
        await transaction.commit();
        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            funcao: usuario.funcao
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
};

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        if( req.usuarioFuncao === 'funcionario' && 
            (await Usuario.findByPk(id)).funcao === 'admin') {
            return res.status(403).json({ 
                message: 'Funcionários não podem deletar administradores' 
            });
        }
        if (req.usuarioFuncao === 'admin' && 
            (await Usuario.findByPk(id)).funcao === 'admin' && 
            await Usuario.count({ where: { funcao: 'admin' } }) <= 1) {
            return res.status(403).json({ 
                message: 'Pelo menos um administrador deve existir' 
            });
        }
        if(req.usuarioFuncao !== 'admin' && 
           req.usuarioFuncao !== 'funcionario' && id !== req.id) {
            return res.status(403).json({ 
                message: 'Usuários comuns só podem deletar a si mesmos' 
            });
        }
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar usuário', error });
    }
}

export default {
    listUsuarios,
    searchUsuario,
    updateUsuario,
    deleteUsuario,
    createUsuario,
    listInfoUsuario
};