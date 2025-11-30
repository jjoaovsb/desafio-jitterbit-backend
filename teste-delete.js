/**
 * SCRIPT DE TESTE - DELETE
 * Tenta apagar um pedido existente no banco.
 */

const ID_PARA_DELETAR = "v10089015vdb-01"; // O ID que deu erro de conflito agora pouco

async function deletarPedido() {
    console.log(`🗑️ Tentando deletar o pedido: ${ID_PARA_DELETAR}...`);

    try {
        const response = await fetch(`http://localhost:3000/order/${ID_PARA_DELETAR}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resultado = await response.json();

        console.log("---------------------------------------------------");
        if (response.status === 200) {
            console.log("✅ SUCESSO! Pedido deletado.");
            console.log("Mensagem da API:", resultado.message);
        } else {
            console.log("❌ ERRO:", resultado);
        }
        console.log("---------------------------------------------------");

    } catch (error) {
        console.error("Erro na conexão:", error.message);
    }
}

deletarPedido();