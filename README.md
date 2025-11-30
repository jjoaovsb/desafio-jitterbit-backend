# 🚀 Desafio Técnico - Jitterbit (Backend)

API REST desenvolvida para integração de pedidos de E-commerce, contemplando transformação de dados (ETL), persistência em banco relacional, segurança via JWT e documentação automatizada.

## 🛠 Tecnologias Utilizadas

* **Node.js** & **Express**
* **PostgreSQL** (Banco de Dados)
* **Sequelize** (ORM)
* **JWT (JsonWebToken)** (Autenticação e Segurança)
* **Swagger** (Documentação da API)

## ⚙️ Funcionalidades

* **Transformação ETL:** Recebe payload em Português (`numeroPedido`), transforma e salva em Inglês (`orderId`) nas tabelas `Orders` e `Items`.
* **Autenticação JWT:** Rotas protegidas. Necessário token Bearer para operações de escrita e leitura.
* **Integridade de Dados:** Uso de Transações (`transactions`) para garantir atomicidade entre Pedido e Itens.
* **CRUD Completo:** Endpoints para Criar, Listar, Buscar por ID, Atualizar e Deletar.
* **Validação:** Tratamento de erros para duplicidade e dados inválidos.

## 🚀 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/jjoaovsb/desafio-jitterbit-backend.git](https://github.com/jjoaovsb/desafio-jitterbit-backend.git)
    cd desafio-jitterbit-backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    * Tenha um banco PostgreSQL rodando (local ou Docker).
    * Renomeie o arquivo `.env.example` para `.env` e configure suas credenciais (`DB_USER`, `DB_PASS`, etc).
    * **Importante:** Defina uma chave secreta na variável `JWT_SECRET` dentro do `.env`.

4.  **Execute o servidor:**
    ```bash
    npm start
    ```
    *O servidor iniciará em `http://localhost:3000` e sincronizará as tabelas automaticamente.*

## 🧪 Testes Automatizados (E2E)

O projeto inclui um script de teste **End-to-End** que valida o ciclo de vida completo da aplicação:
1. Registra um usuário e realiza Login (Obtém Token JWT).
2. Cria um Pedido (POST).
3. Lista os Pedidos (GET).
4. Atualiza o Pedido (PUT).
5. Deleta o Pedido (DELETE).

**Para executar o teste:**
```bash
node teste-completo.js