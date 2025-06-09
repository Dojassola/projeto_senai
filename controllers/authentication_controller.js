import Usuario from "../models/usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const login = async (req, res) => {
    const { identifier, senha } = req.body;

    if (!identifier || !senha) {
        return res.status(400).json({ mensagem: 'Identificador (nome ou CPF) e senha são obrigatórios' });
    }
    try {
        const usuario = await Usuario.findOne({
            where: {
                [Op.or]: [{ cpf: identifier }, { nome: identifier }]
            }
        });

        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET não está definido!");
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }

        const token = jwt.sign({ id: usuario.id, funcao: usuario.funcao }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token) {
            return res.status(500).json({ mensagem: 'Erro ao gerar token' });
        }
        res.status(200).json({ token, usuario: { id: usuario.id, nome: usuario.nome, funcao: usuario.funcao } });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ mensagem: 'Erro ao realizar login', error });
    }
}

const cadastro = async (req, res) => {
    const { nome, senha, cpf, funcao } = req.body;

    if (!nome || !senha || !cpf || !funcao) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ where: { cpf } });
        if (usuarioExistente) {
            return res.status(409).json({ mensagem: 'Usuário já cadastrado' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await Usuario.create({ nome, senha: senhaHash, cpf, funcao });
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário', error });
    }
}
export default { login, cadastro };