# 🚀 Desafio Técnico - Jitterbit (Backend)

API REST desenvolvida para integração de pedidos de E-commerce, com transformação de dados (ETL), persistência em banco relacional e segurança via Token.

## 🛠 Tecnologias Utilizadas

* **Node.js** & **Express**
* **PostgreSQL** (Banco de Dados)
* **Sequelize** (ORM)
* **JWT (JsonWebToken)** (Autenticação e Segurança)
* **Swagger** (Documentação da API)

## ⚙️ Funcionalidades

* **Criação de Pedidos (POST):** Recebe JSON em PT-BR, transforma para EN e salva no banco (Tabelas `Orders` e `Items`).
* **Autenticação JWT:** Rotas protegidas. Apenas usuários autenticados (com Token Bearer) podem criar, editar ou excluir pedidos.
* **Validação:** Impede duplicidade de pedidos e garante integridade dos dados (Transações/Rollback).
* **CRUD Completo:** Listagem, Busca por ID, Atualização e Exclusão.
* **Documentação:** Interface interativa com Swagger.

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
    * Crie um banco de dados PostgreSQL (ex: `jitterbit_test`).
    * Renomeie o arquivo `.env.example` para `.env` e configure suas credenciais.
    * **Importante:** Defina uma chave secreta para o JWT na variável `JWT_SECRET` dentro do `.env`.

4.  **Execute o servidor:**
    ```bash
    npm start
    ```
    *O servidor rodará em `http://localhost:3000`*

## 🔐 Como Testar (Autenticação)

Como a API possui segurança implementada, é necessário gerar um token para utilizar as rotas de Pedidos.

**Opção 1: Via Script Automatizado (Recomendado)**
Execute o script de teste que realiza o fluxo completo (Registrar -> Login -> Criar Pedido com Token):
```bash
node teste-autenticado.js