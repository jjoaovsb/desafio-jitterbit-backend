const express = require('express');
const routes = require('./routes/index');
const sequelize = require('./config/database');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Permite requisições externas
app.use(express.json()); // Habilita parse de JSON no body das requisições

// Rotas da Aplicação
app.use(routes);

// Sincronização com o Banco de Dados (ORM)
// Verifica se as tabelas existem e as cria se necessário.
sequelize.sync({ force: false })
    .then(() => {
        console.log('✅ Conexão com PostgreSQL estabelecida e modelos sincronizados.');
    })
    .catch(err => {
        console.error('❌ Falha fatal ao conectar no banco de dados:', err);
    });

module.exports = app;