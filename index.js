import { fazerLogin } from "./api.js";

function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

function validarSenha(senha) {
    return senha.length >= 6 && senha.length <= 8;
}

function exibirErro(elemento, mensagem) {
    elemento.textContent = mensagem;
    elemento.classList.add("visivel");
}

function esconderErro(elemento) {
    elemento.textContent = "";
    elemento.classList.remove("visivel");
}

document.getElementById("usuario").addEventListener("blur", () => {
    const usuario = document.getElementById("usuario");
    const erroEmail = document.getElementById("erro-email");

    if (!validarEmail(usuario.value)) {
        exibirErro(erroEmail, "Por favor, insira um e-mail válido.");
    } else {
        esconderErro(erroEmail);
    }
});

document.getElementById("senha").addEventListener("blur", () => {
    const senha = document.getElementById("senha");
    const erroSenha = document.getElementById("erro-senha");

    if (!validarSenha(senha.value)) {
        exibirErro(erroSenha, "A senha deve ter entre 6 e 8 caracteres.");
    } else {
        esconderErro(erroSenha);
    }
});


async function validarLogin() {
    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");
    const mensagemErro = document.getElementById("mensagem-erro");
    const loading = document.getElementById("loading");


    esconderErro(mensagemErro);


    loading.style.display = "block";


    if (!validarEmail(usuario.value)) {
        exibirErro(mensagemErro, "E-mail inválido.");
        loading.style.display = "none";
        return;
    }

    if (!validarSenha(senha.value)) {
        exibirErro(mensagemErro, "A senha deve ter entre 6 e 8 caracteres.");
        loading.style.display = "none";
        return;
    }

    const dados = {
        email: usuario.value,
        senha: senha.value,
    };

    try {
        const data = await fazerLogin(dados);

        if (data.access_token) {
            localStorage.setItem("auth_token", data.access_token);
            window.location.href = "dashboard.html";
        } else {
            exibirErro(mensagemErro, "Erro: Token não recebido.");
        }
    } catch (error) {
        exibirErro(mensagemErro, error.message);
    } finally {
        loading.style.display = "none";
    }
}

document.getElementById("botao-login").addEventListener("click", validarLogin);
