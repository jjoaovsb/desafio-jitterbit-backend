const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Busca o token no cabeçalho (Header) da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    // 2. Verifica se o formato é "Bearer <token>"
    const parts = authHeader.split(' ');
    if (!parts.length === 2)
        return res.status(401).json({ error: 'Erro no Token.' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({ error: 'Token malformatado.' });

    // 3. Verifica se o token é válido usando o Segredo
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido ou expirado.' });

        // Se passou, salva o ID do usuário na requisição e deixa passar
        req.userId = decoded.id;
        return next();
    });
};