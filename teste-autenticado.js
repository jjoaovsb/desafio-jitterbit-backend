const BASE_URL = 'http://localhost:3000';

async function testeComAuth() {
    console.log("🔐 INICIANDO TESTE COM AUTENTICAÇÃO JWT\n");

    // 1. TENTAR ACESSAR SEM TOKEN ( falhar)
    console.log("[1] Tentando acessar sem token...");
    let res = await fetch(`${BASE_URL}/order/list`);
    if (res.status === 401) console.log("✅ Bloqueado com sucesso (401 Unauthorized).\n");
    else console.log("❌ ERRO: A API deixou entrar sem senha!\n");

    // 2. REGISTRAR USUÁRIO
    console.log("[2] Criando usuário 'admin'...");
    const userPayload = { username: "admin_teste", password: "123" };
    await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    }); // Ignora erro se já existir

    // 3. FAZER LOGIN (Pegar o Token)
    console.log("[3] Fazendo Login...");
    res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    });
    const loginData = await res.json();
    const TOKEN = loginData.token;

    if (TOKEN) console.log(`✅ Login realizado! Token recebido: ${TOKEN.substring(0, 15)}...\n`);
    else { console.error("❌ Falha no login."); return; }

    // 4. CRIAR PEDIDO (Com Token)
    console.log("[4] Criando pedido USANDO O TOKEN...");
    const pedidoPayload = {
        "numeroPedido": "v-AUTH-01",
        "valorTotal": 500,
        "dataCriacao": new Date(),
        "items": [{ "idItem": "99", "quantidadeItem": 1, "valorItem": 500 }]
    };

    // Primeiro limpamos o pedido anterior (caso exista)
    await fetch(`${BASE_URL}/order/v-AUTH-01`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${TOKEN}` } 
    });

    res = await fetch(`${BASE_URL}/order`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}` // <--- O SEGREDO ESTÁ Anpm start
        },
        body: JSON.stringify(pedidoPayload)
    });

    if (res.status === 201) console.log("✅ Pedido criado com sucesso (Acesso Autorizado)!\n");
    else console.log("❌ Erro ao criar pedido:", res.status);
}

testeComAuth();