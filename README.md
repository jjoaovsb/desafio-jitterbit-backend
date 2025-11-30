# 🚀 Desafio Técnico - Jitterbit (Backend)

API REST desenvolvida para integração de pedidos de E-commerce, com transformação de dados (ETL) e persistência em banco relacional.

## 🛠 Tecnologias Utilizadas

* **Node.js** & **Express**
* **PostgreSQL** (Banco de Dados)
* **Sequelize** (ORM)
* **Swagger** (Documentação da API)

## ⚙️ Funcionalidades

* **Criação de Pedidos (POST):** Recebe JSON em PT-BR, transforma para EN e salva no banco (Tabelas `Orders` e `Items`).
* **Validação:** Impede duplicidade de pedidos e garante integridade dos dados.
* **CRUD Completo:** Listagem, Busca por ID, Atualização e Exclusão.
* **Documentação:**  Swagger.

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
    * Renomeie o arquivo `.env.example` para `.env` e coloque suas credenciais.

4.  **Execute o servidor:**
    ```bash
    npm start
    ```
    *O servidor rodará em `http://localhost:3000`*

## 📚 Documentação (Swagger)

Com o servidor rodando, acesse a documentação interativa em:
👉 **http://localhost:3000/api-docs**

---
Desenvolvido por **João** para o Processo Seletivo Jitterbit.