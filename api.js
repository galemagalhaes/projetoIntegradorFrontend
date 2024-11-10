const BASE_URL = CONFIG.API_URL;

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
            throw new Error(data.message || "Erro na requisição.");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function fazerLogin(dados) {
    try {
        const resultado = await enviarRequisicao("/login", "POST", dados);
        return resultado;
    } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
        throw error;
    }
}

export async function cadastrarUsuario(dados) {
    try {
        const resultado = await enviarRequisicao("/user", "POST", dados);
        return { success: true, message: "Cadastro realizado com sucesso" };
    } catch (error) {

        if (error.message === "Email já cadastrado") {
            return { success: false, message: "E-mail já cadastrado" };
        }

        return { success: false, message: "Erro ao cadastrar. Tente novamente." };
    }
}

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
        return dadosDashboard;
    } catch (error) {
        alert(`Erro ao obter dados do dashboard: ${error.message}`);
        throw error;
    }
}
