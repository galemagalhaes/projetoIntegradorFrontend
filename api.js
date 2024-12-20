const BASE_URL = CONFIG.API_URL;

// Função de enviar requisição
// Função de enviar requisição
async function enviarRequisicao(
    endpoint,
    metodo = "GET",
    dados = null,
    token = null
) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${encodeURIComponent(token)}`;
    }

    const opcoes = {
        method: metodo,
        headers: headers,
    };

    if (dados) {
        opcoes.body = JSON.stringify(dados);
    }

    try {
        const response = await fetch(url, opcoes);
        const data = await response.json();

        if (!response.ok) {
            // Lançar o erro com a mensagem da API
            throw new Error(data.error || "Erro na requisição.");
        }

        return data;
    } catch (error) {
        console.error("Erro no servidor:", error);
        throw error; // Relança o erro para ser capturado nas funções chamadas
    }
}

// Função de login
export async function fazerLogin(dados) {
    console.log("Dados recebidos na função de login:", dados);
    try {
        const resultado = await enviarRequisicao("/login", "POST", dados);
        console.log("Login bem-sucedido:", resultado);
        return resultado;
    } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
        throw error;
    }
}

// Função de cadastro de usuário
export async function cadastrarUsuario(dados) {
    try {
        await enviarRequisicao("/user", "POST", dados);
        return { success: true, message: "Cadastro realizado com sucesso" };
    } catch (error) {
        console.log("Erro completo vindo da API:", error);

        if (error.message === "Email já cadastrado") {
            return { success: false, message: "E-mail já cadastrado" };
        }

        return { success: false, message: "Erro ao cadastrar. Tente novamente." };
    }
}

// Função para obter dados do dashboard
export async function obterDashboard() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }
    try {
        const dadosDashboard = await enviarRequisicao(
            "/dashboard",
            "GET",
            null,
            token
        );
        console.log("Dados do dashboard:", dadosDashboard);
        return dadosDashboard;
    } catch (error) {
        alert(`Erro ao obter dados do dashboard: ${error.message}`);
        throw error;
    }
}

export async function obterClientes() {
    const token = localStorage.getItem("auth_token");
    console.log("Token de autenticação:", token);
    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    try {
        const listaClientes = await enviarRequisicao("/client", "GET", null, token);
        console.log("Lista de clientes:", listaClientes);
        return listaClientes;
    } catch (error) {
        throw error;
    }
}

export async function salvarCliente(dadosCliente) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    try {
        await enviarRequisicao("/client", "POST", dadosCliente, token);
        return { success: true, message: "Cliente salvo com sucesso!" };
    } catch (error) {
        console.log("catch: ", error);

        if (error.message) {
            return { success: false, message: error.message };
        }

        return {
            success: false,
            message: "Erro ao salvar cliente. Tente novamente.",
        };
    }
}

export async function atualizarCliente(dadosCliente) {
    console.log("Dados do cliente:", dadosCliente);
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    try {
        await enviarRequisicao(
            `/client/${dadosCliente.cpf}`,
            "PUT",
            dadosCliente,
            token
        );
        return { success: true, message: "Cliente atualizado com sucesso!" };
    } catch (error) {
        console.log("catch: ", error);

        if (error.message) {
            return { success: false, message: error.message };
        }

        return {
            success: false,
            message: "Erro ao atualizar cliente. Tente novamente.",
        };
    }
}

export async function obterVendas() {
    const token = localStorage.getItem("auth_token");
    console.log("Token de autenticação:", token);
    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    try {
        const listaVendas = await enviarRequisicao("/sale", "GET", null, token);
        return listaVendas;
    } catch (error) {
        throw error;
    }
}

export async function atualizarVenda(dadosVenda) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }

    try {
        await enviarRequisicao(`/sale/${dadosVenda.id}`, "PUT", dadosVenda, token);
        return { success: true, message: "Venda atualizado com sucesso!" };
    } catch (error) {
        console.log("catch: ", error);

        if (error.message) {
            return { success: false, message: error.message };
        }

        return {
            success: false,
            message: "Erro ao atualizar cliente. Tente novamente.",
        };
    }
}

export async function salvarVenda(dadosVenda) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        throw new Error("Token de autenticação não encontrado.");
    }
    console.log("dadosVenda", dadosVenda);
    try {
        await enviarRequisicao("/sale", "POST", dadosVenda, token);
        return { success: true, message: "Venda foi salvo com sucesso!" };
    } catch (error) {
        console.log("catch: ", error);

        if (error.message) {
            return { success: false, message: error.message };
        }

        return {
            success: false,
            message: "Erro ao salvar cliente. Tente novamente.",
        };
    }
}
