import jwt from 'jsonwebtoken';

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    let token;

    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1].trim();
    } else {
        token = authHeader.trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id;
        req.usuarioFuncao = decoded.funcao;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
};

export const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
      if (!rolesPermitidos.includes(req.usuarioFuncao)) {
        return res.status(403).json({ mensagem: 'Acesso negado: função não permitida' });
      }
      next();
    }
  }

export default verifyToken;