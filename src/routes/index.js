const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

/**
 * ARQUIVO DE ROTAS - CORRIGIDO
 * A ordem importa! Rotas específicas devem vir antes de rotas dinâmicas (:id).
 */

router.get('/', (req, res) => res.json({ status: 'API Jitterbit Online' }));

// --- 1. ROTAS ESPECÍFICAS (Devem vir primeiro) ---
router.post('/order', OrderController.create);      // Criar
router.get('/order/list', OrderController.list);    // Listar Todos (AGORA ESTÁ NO LUGAR CERTO)

// --- 2. ROTAS DINÂMICAS (Devem vir por último) ---
router.get('/order/:id', OrderController.getById);  // Buscar um
router.put('/order/:id', OrderController.update);   // Atualizar
router.delete('/order/:id', OrderController.delete);// Deletar

module.exports = router;