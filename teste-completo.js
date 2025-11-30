/**
 * TESTE DE CICLO DE VIDA COMPLETO (E2E) COM SEGURANÇA (JWT)
 * Cenário: Registrar -> Login -> Criar -> Listar -> Consultar -> Atualizar -> Deletar
 */

const BASE_URL = 'http://localhost:3000';
const PEDIDO_ID = "v-TESTE-FINAL-SECURE"; 

async function executarTesteCompleto() {
    console.log("====================================================");
    console.log("🚀 INICIANDO TESTE E2E (COM AUTENTICAÇÃO)");
    console.log("====================================================");

    // --- PASSO 0: AUTENTICAÇÃO ---
    console.log(`\n[0/6] PREPARANDO ACESSO (Login)...`);
    const userPayload = { username: "tester_bot", password: "123" };
    
    // Tenta registrar (ignora erro se já existir)
    await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    });

    // Faz Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    });
    const loginJson = await loginRes.json();
    const TOKEN = loginJson.token;

    if (!TOKEN) {
        console.error("❌ Erro fatal: Não foi possível obter o token de acesso.");
        return;
    }
    console.log("✅ Token JWT obtido com sucesso.");

    // Header padrão com o Token
    const AUTH_HEADERS = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}` 
    };

    // --- LIMPEZA INICIAL ---
    await fetch(`${BASE_URL}/order/${PEDIDO_ID}`, { method: 'DELETE', headers: AUTH_HEADERS });

    // --- 1. CRIAR (POST) ---
    console.log(`\n[1/6] CRIANDO PEDIDO (${PEDIDO_ID})...`);
    const payloadCreate = {
        "numeroPedido": PEDIDO_ID,
        "valorTotal": 500.00,
        "dataCriacao": new Date().toISOString(),
        "items": [{ "idItem": "100", "quantidadeItem": 2, "valorItem": 250.00 }]
    };

    let res = await fetch(`${BASE_URL}/order`, {
        method: 'POST',
        headers: AUTH_HEADERS, // Enviando o Token!
        body: JSON.stringify(payloadCreate)
    });
    
    if (res.status === 201) console.log("✅ Sucesso! Pedido criado.");
    else {
        const err = await res.json();
        return console.error("❌ Falha ao criar:", err);
    }

    // --- 2. LISTAR TODOS (GET) ---
    console.log(`\n[2/6] LISTANDO TODOS OS PEDIDOS...`);
    res = await fetch(`${BASE_URL}/order/list`, { headers: AUTH_HEADERS });
    let json = await res.json();
    
    const encontrado = json.find(p => p.orderId === PEDIDO_ID);
    if (res.status === 200 && encontrado) console.log(`✅ Sucesso! O pedido foi encontrado na lista.`);
    else return console.error("❌ Falha ao listar.");

    // --- 3. BUSCAR POR ID (GET) ---
    console.log(`\n[3/6] BUSCANDO DETALHES DO PEDIDO...`);
    res = await fetch(`${BASE_URL}/order/${PEDIDO_ID}`, { headers: AUTH_HEADERS });
    json = await res.json();

    if (res.status === 200 && json.orderId === PEDIDO_ID) console.log("✅ Sucesso! Detalhes recuperados.");
    else return console.error("❌ Falha ao buscar por ID.");

    // --- 4. ATUALIZAR (PUT) ---
    console.log(`\n[4/6] ATUALIZANDO VALOR...`);
    const payloadUpdate = {
        "valorTotal": 900.00,
        "items": [{ "idItem": "100", "quantidadeItem": 2, "valorItem": 450.00 }]
    };

    res = await fetch(`${BASE_URL}/order/${PEDIDO_ID}`, {
        method: 'PUT',
        headers: AUTH_HEADERS,
        body: JSON.stringify(payloadUpdate)
    });
    json = await res.json();

    if (res.status === 200 && json.value === 900) console.log("✅ Sucesso! Valor atualizado.");
    else return console.error("❌ Falha ao atualizar.");

    // --- 5. DELETAR (DELETE) ---
    console.log(`\n[5/6] DELETANDO PEDIDO...`);
    res = await fetch(`${BASE_URL}/order/${PEDIDO_ID}`, { 
        method: 'DELETE',
        headers: AUTH_HEADERS 
    });
    
    if (res.status === 200) console.log("✅ Sucesso! Pedido removido.");
    else return console.error("❌ Falha ao deletar.");

    // --- 6. CONFIRMAÇÃO FINAL ---
    res = await fetch(`${BASE_URL}/order/${PEDIDO_ID}`, { headers: AUTH_HEADERS });
    if (res.status === 404) {
        console.log("\n====================================================");
        console.log("🏆 TESTE SEGURANÇA!");
        console.log("====================================================");
    } else {
        console.error("❌ Erro: O pedido ainda existe!");
    }
}

executarTesteCompleto();