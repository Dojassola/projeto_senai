import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";
export const listUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
}

export const searchUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
}

export const createUsuario = async (req, res) => {
    const { nome, cpf, senha, funcao } = req.body;
    
    try {
        if (req.usuarioFuncao === 'funcionario' && funcao === 'admin') {
            return res.status(403).json({ 
                message: 'Funcionários só podem cadastrar alunos e professores' 
            });
        }
        if (req.usuarioFuncao === 'funcionario' && 
            !['aluno', 'professor'].includes(funcao)) {
            return res.status(403).json({ 
                message: 'Função inválida' 
            });
        }

        const hashSenha = await bcrypt.hash(senha, 10);
        const usuario = await Usuario.create({
            nome,
            cpf,
            senha: hashSenha,
            funcao
        });

        res.status(201).json({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            funcao: usuario.funcao
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
};

export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, senha, cpf, funcao } = req.body;
    
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

        usuario.nome = nome || usuario.nome;
        usuario.cpf = cpf || usuario.cpf;
        
        if (senha) {
            usuario.senha = await bcrypt.hash(senha, 10);
        }
        
        if (funcao) {
            usuario.funcao = funcao;
        }

        await usuario.save();

        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            funcao: usuario.funcao
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
};

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
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
    createUsuario
};