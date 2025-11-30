const Order = require('../models/Order');
const Item = require('../models/Item');
const sequelize = require('../config/database');

/**
 * Controller de Pedidos
 * Responsável pela lógica de negócio e transformação de dados (ETL).
 */
module.exports = {

    /**
     * CRIAÇÃO DE PEDIDO (POST)
     * Realiza a integração de um pedido recebido em JSON (PT-BR)
     * para o banco de dados Relacional (EN).
     */
    async create(req, res) {
        // Iniciamos uma Transação (Transaction).
        // Isso garante atomicidade: Ou salvamos o Pedido E os Itens com sucesso,
        // ou desfazemos tudo. Essencial para integridade financeira.
        const t = await sequelize.transaction();

        try {
            const entrada = req.body;

            // 1. VALIDAÇÃO DE DADOS (Data Quality)
            // Verificamos se os campos chaves para a integração existem.
            if (!entrada.numeroPedido || !entrada.items || !Array.isArray(entrada.items)) {
                await t.rollback(); // Cancela a transação se o dado for inválido
                return res.status(400).json({ 
                    error: "Payload inválido.", 
                    message: "Os campos 'numeroPedido' e o array 'items' são obrigatórios." 
                });
            }

            // 2. TRANSFORMAÇÃO DE DADOS (ETL: Mapping)
            // O sistema de origem envia em Português.
            // O sistema de destino (Banco SQL) exige em Inglês conforme especificação.
            
            // 2.1 Mapeamento do Cabeçalho (Header)
            const orderData = {
                orderId: entrada.numeroPedido,      // Source: numeroPedido -> Target: orderId
                value: entrada.valorTotal,          // Source: valorTotal   -> Target: value
                creationDate: entrada.dataCriacao   // Source: dataCriacao  -> Target: creationDate
            };

            // 3. PERSISTÊNCIA (LOAD) - TABELA PAI
            // Tentamos criar o pedido. Se o ID já existir, o banco retornará erro (Unique Constraint).
            await Order.create(orderData, { transaction: t });

            // 4. TRANSFORMAÇÃO DOS ITENS (ETL: Mapping Recursivo)
            // Iteramos sobre o array de itens para adaptar os campos e vincular ao pai (Foreign Key).
            const itemsData = entrada.items.map(item => ({
                orderId: entrada.numeroPedido,      // FK: Vínculo com a tabela Orders
                productId: parseInt(item.idItem),   // Conversão de Tipo: String -> Integer
                quantity: item.quantidadeItem,
                price: item.valorItem
            }));

            // 5. PERSISTÊNCIA (LOAD) - TABELA FILHA
            // bulkCreate é utilizado para performance, inserindo todos os itens de uma vez.
            await Item.bulkCreate(itemsData, { transaction: t });

            // 6. COMMIT
            // Se chegamos até aqui sem erros, efetivamos as mudanças no banco.
            await t.commit();

            // 7. RESPOSTA
            // Buscamos o objeto consolidado no banco para retornar a estrutura completa (com itens).
            const result = await Order.findByPk(entrada.numeroPedido, {
                include: [{ 
                    model: Item, 
                    as: 'items',
                    attributes: ['productId', 'quantity', 'price'] // Selecionamos apenas campos relevantes
                }]
            });

            return res.status(201).json(result);

        } catch (error) {
            // ROLLBACK
            // Em caso de qualquer falha (banco fora, erro de sintaxe, ID duplicado),
            // desfazemos qualquer alteração feita nesta tentativa.
            await t.rollback();

            console.error("Erro na integração do pedido:", error);

            // Tratamento específico para duplicidade (Erro comum em integração)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ error: "Conflito.", message: "Este número de pedido já foi processado." });
            }

            return res.status(500).json({ error: "Falha interna na integração.", details: error.message });
        }
    },

    /**
     * LISTAGEM DE PEDIDOS (GET)
     * Retorna todos os pedidos com seus respectivos itens.
     */
    async list(req, res) {
        try {
            const orders = await Order.findAll({
                include: [{ model: Item, as: 'items' }] // Eager Loading: Traz os itens na mesma consulta
            });
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar pedidos.", details: error.message });
        }
    },

    /**
     * BUSCA POR ID (GET)
     * Endpoint para consulta de status de um pedido específico.
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id, {
                include: [{ model: Item, as: 'items' }]
            });

            if (!order) {
                return res.status(404).json({ message: "Pedido não encontrado na base de dados." });
            }

            return res.json(order);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar pedido.", details: error.message });
        }
    },

    /**
     * ATUALIZAR PEDIDO (PUT) - Opcional
     * Permite atualizar valores ou itens de um pedido.
     * Utiliza estratégia de Full Replace para os itens para garantir consistência.
     */
    async update(req, res) {
        const t = await sequelize.transaction(); // Transação obrigatória para Updates complexos
        try {
            const { id } = req.params;
            const entrada = req.body;

            // 1. Verifica existência
            const pedido = await Order.findByPk(id);
            if (!pedido) {
                await t.rollback();
                return res.status(404).json({ message: "Pedido não encontrado para atualização." });
            }

            // 2. Atualiza dados do Cabeçalho (se fornecidos)
            if (entrada.valorTotal) pedido.value = entrada.valorTotal;
            if (entrada.dataCriacao) pedido.creationDate = entrada.dataCriacao;
            
            await pedido.save({ transaction: t });

            // 3. Atualiza Itens (Se fornecidos)
            if (entrada.items && Array.isArray(entrada.items)) {
                // Estratégia Segura: Removemos os antigos e recriamos os novos
                await Item.destroy({ where: { orderId: id }, transaction: t });

                const itemsData = entrada.items.map(item => ({
                    orderId: id,
                    productId: parseInt(item.idItem),
                    quantity: item.quantidadeItem,
                    price: item.valorItem
                }));

                await Item.bulkCreate(itemsData, { transaction: t });
            }

            // Confirma alterações
            await t.commit();

            // Retorna o pedido atualizado
            const atualizado = await Order.findByPk(id, { include: [{ model: Item, as: 'items' }]});
            return res.json(atualizado);

        } catch (error) {
            await t.rollback();
            return res.status(500).json({ error: "Erro ao atualizar.", details: error.message });
        }
    },

    /**
     * DELETAR PEDIDO (DELETE) - Opcional
     * Remove o pedido do banco de dados.
     * Devido ao relacionamento (Cascade), os itens são removidos automaticamente.
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            // Busca o pedido para garantir que existe
            const pedido = await Order.findByPk(id);
            if (!pedido) {
                return res.status(404).json({ message: "Pedido não encontrado." });
            }

            // Executa a exclusão
            await pedido.destroy();

            return res.status(200).json({ message: "Pedido e itens removidos com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao deletar.", details: error.message });
        }
    }
};