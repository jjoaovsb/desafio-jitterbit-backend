/**
 * ARQUIVO DE INICIALIZAÇÃO (ENTRY POINT)
 * * Responsabilidade:
 * Este arquivo é responsável apenas por "subir" o servidor.
 * Ele importa a aplicação configurada (app.js) e a escuta em uma porta de rede.
 * * Por que separar server.js de app.js?
 * R: Para permitir que a aplicação seja testada (TDD) sem necessariamente
 * abrir a porta de rede, facilitando testes de integração (Supertest).
 */

const app = require('./app');

// Define a porta: Usa a variável de ambiente PORT (boas práticas para Cloud/Heroku)
// ou usa a porta 3000 como fallback para desenvolvimento local.
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(`🚀 SERVIDOR INICIADO COM SUCESSO!`);
    console.log(`📡 Endereço: http://localhost:${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'Desenvolvimento'}`);
    console.log('---------------------------------------------------------');
});