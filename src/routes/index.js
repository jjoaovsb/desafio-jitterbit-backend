const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');

/**
 * ARQUIVO DE ROTAS
 */

// --- ROTA RAIZ (Redirecionamento Automático) ---
// Se o recrutador abrir localhost:3000, ele cai direto na documentação!
router.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// --- ROTAS PÚBLICAS ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// --- BARREIRA DE SEGURANÇA ---
router.use(authMiddleware); 

// --- ROTAS PROTEGIDAS ---
// Rotas específicas PRIMEIRO
router.get('/order/list', OrderController.list);

// Rotas genéricas/dinâmicas DEPOIS
router.post('/order', OrderController.create);
router.get('/order/:id', OrderController.getById);
router.put('/order/:id', OrderController.update);
router.delete('/order/:id', OrderController.delete);

module.exports = router;