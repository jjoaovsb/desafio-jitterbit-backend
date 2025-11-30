const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    // 1. REGISTRAR USUÁRIO (Cria conta no banco)
    async register(req, res) {
        try {
            const { username, password } = req.body;
            
            // Criptografa a senha antes de salvar
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ username, password: hashedPassword });
            
            user.password = undefined; // Segurança: Não devolve a senha na resposta
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ error: "Falha ao registrar.", details: error.message });
        }
    },

    // 2. LOGIN (Gera o Token)
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Busca usuário
            const user = await User.findOne({ where: { username } });
            if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

            // Compara a senha enviada com a senha criptografada no banco
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(400).json({ error: "Senha inválida." });
            }

            // GERA O TOKEN (A "Pulseira VIP")
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400, // Token expira em 1 dia
            });

            // Retorna o token para o usuário usar
            return res.json({ 
                user: user.username, 
                token: token 
            });
        } catch (error) {
            return res.status(500).json({ error: "Erro no login." });
        }
    }
};