const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');

/**
 * Modelo: Item (Itens do Pedido)
 * Representa os produtos individuais contidos em um pedido.
 * Relacionamento 1:N com a tabela Order.
 */
const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID interno sequencial do item'
    },
    // Chave Estrangeira (Foreign Key) para vínculo com o Pedido
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Order,
            key: 'orderId'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'Items',
    timestamps: false
});

// Definição do Relacionamento (Associação)
// Um Pedido (Order) possui muitos Itens (hasMany)
// Um Item pertence a um Pedido (belongsTo)
Order.hasMany(Item, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
Item.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Item;