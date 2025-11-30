const express = require('express');
const routes = require('./routes/index');
const sequelize = require('./config/database');
const cors = require('cors');

// --- Importações do Swagger ---
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json());

// --- Rota da Documentação ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

// Sincroniza o banco ao iniciar
sequelize.sync({ force: false })
    .then(() => console.log('✅ Banco Sincronizado!'))
    .catch(err => console.error('❌ Erro no banco:', err));

module.exports = app;