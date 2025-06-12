import Usuario from "../models/usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const cadastro = async (req, res) => {
    const { nome, senha, cpf, funcao } = req.body;

    if (!nome || !senha || !cpf || !funcao) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {

        const usuarioExistente = await Usuario.findOne({ where: { cpf: cpf } });
        if (usuarioExistente) {
            return res.status(409).json({ mensagem: 'Usuário já cadastrado' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const cpfNumerico = cpf.replace(/\D/g, '');
        const novoUsuario = await Usuario.create({ 
            nome, 
            senha: senhaHash, 
            cpf: cpfNumerico, 
            funcao 
        });
        
        res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            cpf: novoUsuario.cpf,
            funcao: novoUsuario.funcao
        });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário', error: error.message });
    }
};

export const login = async (req, res) => {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        console.log('Missing credentials');
        return res.status(400).json({ mensagem: 'CPF e senha são obrigatórios' });
    }

    try {
        const usuario = await Usuario.findOne({ where: { cpf } });
        if (!usuario) {
            console.log('User not found');
            return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            console.log('Invalid password');
            return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: usuario.id, funcao: usuario.funcao }, 
            process.env.JWT_SECRET || 'default_secret_for_tests',
            { expiresIn: '1h' }
        );

        console.log('Login successful:', usuario.id);
        res.status(200).json({ 
            token, 
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                funcao: usuario.funcao
            }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ mensagem: 'Erro ao realizar login', error: error.message });
    }
};

export default { login, cadastro };