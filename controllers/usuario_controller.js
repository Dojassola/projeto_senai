import Usuario from "../models/usuario";

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
    const { nome, senha, cpf, funcao } = req.body;
    try {
        const novoUsuario = await Usuario.create({ nome, senha, cpf, funcao });
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
}
export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, senha, cpf, funcao } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        usuario.nome = nome;
        usuario.senha = senha;
        usuario.cpf = cpf;
        usuario.funcao = funcao;
        await usuario.save();
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
}
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
    createUsuario,
    updateUsuario,
    deleteUsuario
};