/**
 * SCRIPT DE SIMULAÇÃO DE E-COMMERCE
 * Envia um payload JSON (PT-BR) para a nossa API.
 */

async function enviarPedido() {
    // 1. O Payload (Carga de dados)
    const pedidoEcommerce = {
        "numeroPedido": "v10089015vdb-01",
        "valorTotal": 10000,
        "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
        "items": [
            {
                "idItem": "2434",
                "quantidadeItem": 1,
                "valorItem": 1000
            }
        ]
    };

    console.log("📤 Enviando pedido para a API...");
    console.log("Payload Original (PT-BR):", JSON.stringify(pedidoEcommerce, null, 2));

    try {
        // Envia para o seu servidor local
        const response = await fetch('http://localhost:3000/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoEcommerce)
        });

        const resultado = await response.json();

        console.log("---------------------------------------------------");
        if (response.status === 201) {
            console.log("✅ SUCESSO! Integração realizada.");
            console.log("📥 Resposta da API (Banco de Dados / EN):");
            // Aqui vemos se a transformação funcionou
            console.log(JSON.stringify(resultado, null, 2)); 
        } else {
            console.log("❌ ERRO:", resultado);
        }
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("Erro na conexão:", error.message);
    }
}

enviarPedido();