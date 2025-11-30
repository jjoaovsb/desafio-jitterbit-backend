require('dotenv').config();
const Sequelize = require('sequelize');

/**
 * Configuração da Conexão com Banco de Dados (PostgreSQL)
 * Utiliza variáveis de ambiente para segurança das credenciais.
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // 'postgres'
    logging: false, // Define como true para debugar queries SQL no terminal
    
    // Configurações de Pool de Conexão (Boa prática para produção)
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false // Padrão global para não criar colunas created_at/updated_at automáticas
    }
});

module.exports = sequelize;