/**
 * TESTE (CRUD)
 * Cenário: Criar -> Listar -> Consultar -> Atualizar -> Deletar
 */

const BASE_URL = 'http://localhost:3000/order';
const PEDIDO_ID = "v-TESTE-FINAL-01"; // Um ID exclusivo para esse teste

async function executarTesteCompleto() {
    console.log("====================================================");
    console.log("🚀 INICIANDO TESTE DE CICLO");
    console.log("====================================================");

    // PASSO 0: LIMPEZA (Garante que não vai dar erro de duplicidade)
    await fetch(`${BASE_URL}/${PEDIDO_ID}`, { method: 'DELETE' });

    // --- 1. CRIAR (POST) ---
    console.log(`\n[1/5] CRIANDO PEDIDO (${PEDIDO_ID})...`);
    const payloadCreate = {
        "numeroPedido": PEDIDO_ID,
        "valorTotal": 500.00,
        "dataCriacao": new Date().toISOString(),
        "items": [{ "idItem": "100", "quantidadeItem": 2, "valorItem": 250.00 }]
    };

    let res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadCreate)
    });
    let json = await res.json();

    if (res.status === 201) console.log("✅ Sucesso! Pedido criado.");
    else return console.error("❌ Falha ao criar:", json);


    // --- 2. LISTAR TODOS (GET) ---
    console.log(`\n[2/5] LISTANDO TODOS OS PEDIDOS...`);
    res = await fetch(`${BASE_URL}/list`);
    json = await res.json();
    
    // Verifica se nosso pedido está na lista
    const encontrado = json.find(p => p.orderId === PEDIDO_ID);
    if (res.status === 200 && encontrado) console.log(`✅ Sucesso! O pedido ${PEDIDO_ID} foi encontrado na lista.`);
    else return console.error("❌ Falha ao listar ou pedido não encontrado.");


    // --- 3. BUSCAR POR ID (GET) ---
    console.log(`\n[3/5] BUSCANDO DETALHES DO PEDIDO...`);
    res = await fetch(`${BASE_URL}/${PEDIDO_ID}`);
    json = await res.json();

    if (res.status === 200 && json.orderId === PEDIDO_ID) console.log("✅ Sucesso! Detalhes recuperados corretamente.");
    else return console.error("❌ Falha ao buscar por ID.");


    // --- 4. ATUALIZAR (PUT) ---
    console.log(`\n[4/5] ATUALIZANDO VALOR (De 500 para 900)...`);
    const payloadUpdate = {
        "valorTotal": 900.00,
        "items": [{ "idItem": "100", "quantidadeItem": 2, "valorItem": 450.00 }] // Atualizando preço do item também
    };

    res = await fetch(`${BASE_URL}/${PEDIDO_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadUpdate)
    });
    json = await res.json();

    if (res.status === 200 && json.value === 900) console.log("✅ Sucesso! Valor atualizado no banco.");
    else return console.error("❌ Falha ao atualizar.");


    // --- 5. DELETAR (DELETE) ---
    console.log(`\n[5/5] DELETANDO PEDIDO...`);
    res = await fetch(`${BASE_URL}/${PEDIDO_ID}`, { method: 'DELETE' });
    
    if (res.status === 200) console.log("✅ Sucesso! Pedido removido.");
    else return console.error("❌ Falha ao deletar.");


    // CONFIRMAÇÃO FINAL
    // Tenta buscar de novo para garantir que sumiu (deve dar 404)
    res = await fetch(`${BASE_URL}/${PEDIDO_ID}`);
    if (res.status === 404) {
        console.log("\n====================================================");
        console.log("🏆 TESTE GABARITADO! TODAS AS ROTAS FUNCIONAM.");
        console.log("====================================================");
    } else {
        console.error("❌ Erro: O pedido ainda existe após o delete!");
    }
}

executarTesteCompleto();