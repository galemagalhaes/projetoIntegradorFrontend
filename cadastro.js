import { cadastrarUsuario } from "./api.js";

function validarNome() {
    const nome = document.getElementById("nomeCadastro").value.trim();
    const erroNome = document.getElementById("erroNome");

    if (nome === "") {
        erroNome.textContent = "O campo Nome é obrigatório.";
        erroNome.classList.add("visivel");
        return false;
    } else {
        erroNome.textContent = "";
        erroNome.classList.remove("visivel");
        return true;
    }
}

function validarEmail() {
    const email = document.getElementById("emailCadastro").value.trim();
    const erroEmail = document.getElementById("erroEmail");
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
        erroEmail.textContent = "Insira um email válido.";
        erroEmail.classList.add("visivel");
        return false;
    } else {
        erroEmail.textContent = "";
        erroEmail.classList.remove("visivel");
        return true;
    }
}

function validarSenha() {
    const senha = document.getElementById("senha").value;
    const erroSenha = document.getElementById("erroSenha");

    if (senha.length < 6 || senha.length > 8) {
        erroSenha.textContent = "A senha deve ter entre 6 a 8 caracteres.";
        erroSenha.classList.add("visivel");
        return false;
    } else {
        erroSenha.textContent = "";
        erroSenha.classList.remove("visivel");
        return true;
    }
}

function validarConfirmarSenha() {
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");

    if (senha === "") {
        erroConfirmarSenha.textContent = "";
        erroConfirmarSenha.classList.remove("visivel");
        return true;
    }

    if (confirmarSenha !== "") {
        if (senha !== confirmarSenha) {
            erroConfirmarSenha.textContent = "As senhas não conferem.";
            erroConfirmarSenha.classList.add("visivel");
            return false;
        } else {
            erroConfirmarSenha.textContent = "";
            erroConfirmarSenha.classList.remove("visivel");
            return true;
        }
    } else {
        erroConfirmarSenha.textContent = "";
        erroConfirmarSenha.classList.remove("visivel");
        return true;
    }
}

function toggleSenha(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (input.type === "password") {
        input.type = "text";
        button.innerHTML =
            '<span class="material-icons" style="color: #f0ffffde; cursor: pointer;">visibility_off</span>';
    } else {
        input.type = "password";
        button.innerHTML =
            '<span class="material-icons" style="color: #f0ffffde; cursor: pointer;">visibility</span>';
    }
}

async function validarCadastro() {
    const nomeValido = validarNome();
    const emailValido = validarEmail();
    const senhaValida = validarSenha();
    const confirmarSenhaValida = validarConfirmarSenha();
    const mensagemErro = document.getElementById("mensagem-erro");

    if (nomeValido && emailValido && senhaValida && confirmarSenhaValida) {
        const dados = {
            nome: document.getElementById("nomeCadastro").value,
            email: document.getElementById("emailCadastro").value,
            senha: document.getElementById("senha").value,
        };

        try {
            const data = await cadastrarUsuario(dados);

            if (data.success) {
                const modal = document.getElementById("modalSucesso");
                modal.style.display = "block";

                setTimeout(() => {
                    modal.style.display = "none";
                    window.location.href = "index.html";
                }, 3000);
            } else {
                console.log(data);
                exibirErro(mensagemErro, data.message || "Erro ao cadastrar.");
            }
        } catch (error) {
            exibirErro(mensagemErro, "Erro ao tentar se comunicar com o servidor.");
        }
    }
}

function exibirErro(mensagemElemento, mensagem) {
    mensagemElemento.textContent = mensagem;
    mensagemElemento.classList.add("visivel");
}

function removerErro(event) {
    const campoErro = document.getElementById(
        `erro${event.target.name.charAt(0).toUpperCase() + event.target.name.slice(1)
        }`
    );
    campoErro.textContent = "";
    campoErro.classList.remove("visivel");
}

document.getElementById("senha").addEventListener("input", validarConfirmarSenha);
document.getElementById("confirmarSenha").addEventListener("input", validarConfirmarSenha);

document.getElementById("nomeCadastro").addEventListener("blur", validarNome);
document.getElementById("emailCadastro").addEventListener("blur", validarEmail);
document.getElementById("senha").addEventListener("blur", validarSenha);
document.getElementById("confirmarSenha").addEventListener("blur", validarConfirmarSenha);
document.getElementById("confirmarSenha").addEventListener("input", validarConfirmarSenha);

document.getElementById("nomeCadastro").addEventListener("input", removerErro);
document.getElementById("emailCadastro").addEventListener("input", removerErro);
document.getElementById("senha").addEventListener("input", removerErro);
document.getElementById("confirmarSenha").addEventListener("input", function () {
    const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");
    erroConfirmarSenha.textContent = "";
    erroConfirmarSenha.classList.remove("visivel");
});

document
    .getElementById("mostrarSenha")
    .addEventListener("click", () => toggleSenha("senha", "mostrarSenha"));
document
    .getElementById("mostrarConfirmarSenha")
    .addEventListener("click", () =>
        toggleSenha("confirmarSenha", "mostrarConfirmarSenha")
    );

document
    .getElementById("botaoCadastro")
    .addEventListener("click", validarCadastro);

document.getElementById("botaoVoltar").addEventListener("click", function () {
    console.log("Botão Voltar clicado");
    window.location.href = "index.html";
});
