const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');

router.get('/', (req, res) => res.json({ status: 'API Jitterbit Online' }));

// --- ROTAS PÚBLICAS (Qualquer um pode acessar) ---
router.post('/auth/register', AuthController.register); // Criar conta
router.post('/auth/login', AuthController.login);       // Fazer login

// --- BARREIRA DE SEGURANÇA ---
// Tudo o que estiver abaixo desta linha exige Token JWT
router.use(authMiddleware); 

// --- ROTAS PROTEGIDAS (Só com Token) ---
router.post('/order', OrderController.create);
router.get('/order/list', OrderController.list);
router.get('/order/:id', OrderController.getById);
router.put('/order/:id', OrderController.update);
router.delete('/order/:id', OrderController.delete);

module.exports = router;