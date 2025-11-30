const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo: Order (Pedidos)
 * Representa a tabela principal de vendas no banco de dados.
 * Estrutura definida conforme requisitos do desafio técnico.
 */
const Order = sequelize.define('Order', {
    // Chave Primária definida manualmente (String) para aceitar IDs alfanuméricos (ex: "v10089015vdb")
    orderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: 'Identificador único do pedido vindo do sistema de origem'
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: 'Valor total do pedido'
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Data de criação original do pedido'
    }
}, {
    tableName: 'Orders', // Nome explícito da tabela no Postgres
    timestamps: false    // Desativado pois usamos 'creationDate' customizado
});

module.exports = Order;