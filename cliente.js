import { validarToken } from "./auth.js";
import { obterClientes, salvarCliente, atualizarCliente } from "./api.js";

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarTelefone(telefone) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function abrirModal() {
    const modalFormulario = document.getElementById("modal-formulario");
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.textContent = "Adicionar Cliente";
    modalFormulario.style.display = "block";
}

function fecharModal() {
    const modalFormulario = document.getElementById("modal-formulario");
    document.getElementById("cpfCliente").value = "";
    document.getElementById("nomeCliente").value = "";
    document.getElementById("emailCliente").value = "";
    document.getElementById("telefoneCliente").value = "";
    modalFormulario.style.display = "none";
}

function validarNome() {
    const nome = document.getElementById("nomeCliente").value.trim();
    const erroNome = document.getElementById("erroNome");

    if (nome === "") {
        erroNome.textContent = "O campo Nome é obrigatório.";
        erroNome.classList.add("visivel");
        return false;
    }

    if (nome.length < 3) {
        erroNome.textContent = "O Nome deve ter no mínimo 3 caracteres.";
        erroNome.classList.add("visivel");
        return false;
    }

    erroNome.textContent = "";
    erroNome.classList.remove("visivel");
    return true;
}

function limparErroNome() {
    const erroCpf = document.getElementById("erroNome");
    erroCpf.textContent = "";
    erroCpf.classList.remove("visivel");
}

function validarCPF() {
    console.log("entrou no validarCPF");
    const cpfInput = document.getElementById("cpfCliente");
    const cpf = cpfInput.value.replace(/\D/g, "");
    const erroCPF = document.getElementById("erroCpf");

    console.log("Blur disparado no campo CPF");

    if (cpf.length === 0) {
        erroCPF.textContent = "O campo CPF é obrigatório.";
        erroCPF.classList.add("visivel");
        return false;
    }

    if (cpf.length !== 11) {
        erroCPF.textContent = "O CPF deve conter 11 dígitos.";
        erroCPF.classList.add("visivel");
        return false;
    }

    if (!cpfValido(cpf)) {
        erroCPF.textContent = "O CPF informado é inválido.";
        erroCPF.classList.add("visivel");
        return false;
    }

    erroCPF.textContent = "";
    erroCPF.classList.remove("visivel");
    return true;
}

function limparErroCpf() {
    const erroCpf = document.getElementById("erroCpf");
    erroCpf.textContent = "";
    erroCpf.classList.remove("visivel");
}

function cpfValido(cpf) {
    let soma = 0;
    let resto;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf[i - 1]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf[i - 1]) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
}

function validarEmail() {
    const emailInput = document.getElementById("emailCliente");
    const email = emailInput.value.trim();
    const erroEmail = document.getElementById("erroEmail");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        erroEmail.textContent = "O campo Email é obrigatório.";
        erroEmail.classList.add("visivel");
        return false;
    }

    if (!emailRegex.test(email)) {
        erroEmail.textContent = "O Email informado é inválido.";
        erroEmail.classList.add("visivel");
        return false;
    }

    erroEmail.textContent = "";
    erroEmail.classList.remove("visivel");
    return true;
}

function limparErroEmail() {
    const erroEmail = document.getElementById("erroEmail");
    erroEmail.textContent = "";
    erroEmail.classList.remove("visivel");
}

function validarTelefone() {
    const telefoneInput = document.getElementById("telefoneCliente");
    const telefone = telefoneInput.value.replace(/\D/g, "");
    const erroTelefone = document.getElementById("erroTelefone");

    console.log("Blur disparado no campo Telefone");

    if (telefone.length === 0) {
        erroTelefone.textContent = "O campo Telefone é obrigatório.";
        erroTelefone.classList.add("visivel");
        return false;
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
        erroTelefone.textContent =
            "O telefone deve ter 10 dígitos (fixo) ou 11 dígitos (celular).";
        erroTelefone.classList.add("visivel");
        return false;
    }

    erroTelefone.textContent = "";
    erroTelefone.classList.remove("visivel");
    return true;
}

function limparErroTelefone() {
    const erroTelefone = document.getElementById("erroTelefone");
    erroTelefone.textContent = "";
    erroTelefone.classList.remove("visivel");
}

async function carregarListaClientes() {
    if (!validarToken()) return;

    try {
        const loading = document.getElementById("loading");
        loading.style.display = "block";
        const clientes = await obterClientes();

        preencherTabelaClientes(clientes);
        configurarBusca(clientes);

        document
            .getElementById("adicionarCliente")
            .addEventListener("click", abrirModal);
        document
            .getElementById("fechar-modal")
            .addEventListener("click", fecharModal);

        document
            .getElementById("nomeCliente")
            .addEventListener("blur", validarNome);
        document.getElementById("cpfCliente").addEventListener("blur", validarCPF);
        document
            .getElementById("emailCliente")
            .addEventListener("blur", validarEmail);
        document
            .getElementById("telefoneCliente")
            .addEventListener("blur", validarTelefone);

        document
            .getElementById("nomeCliente")
            .addEventListener("input", limparErroNome);

        document
            .getElementById("cpfCliente")
            .addEventListener("input", limparErroCpf);

        document
            .getElementById("emailCliente")
            .addEventListener("input", limparErroEmail);
        document
            .getElementById("telefoneCliente")
            .addEventListener("input", limparErroTelefone);
    } catch (error) {
        alert("Não foi possível carregar a lista de clientes.");
        console.error("Erro ao carregar clientes:", error);
    } finally {
        loading.style.display = "none";
    }
}

function preencherTabelaClientes(clientes) {
    const tabela = document.getElementById("tabelaClientes");
    tabela.innerHTML = "";

    clientes.forEach((cliente) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
        <td>${formatarCPF(cliente.cpf)}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${formatarTelefone(cliente.telefone)}</td>
        <td><button class="btn-atualizar" data-cpf="${cliente.cpf
            }">Atualizar</button></td>
      `;
        tabela.appendChild(linha);
    });

    const botoesAtualizar = document.querySelectorAll(".btn-atualizar");
    botoesAtualizar.forEach((botao) => {
        botao.addEventListener("click", function () {
            const cpf = this.dataset.cpf;
            carregarClienteNoModal(cpf, clientes);
        });
    });
}

function carregarClienteNoModal(cpf, clientes) {
    const cliente = clientes.find((cliente) => cliente.cpf === cpf);

    if (cliente) {
        document.getElementById("nomeCliente").value = cliente.nome;
        document.getElementById("emailCliente").value = cliente.email;
        document.getElementById("telefoneCliente").value = cliente.telefone;
        document.getElementById("cpfCliente").value = formatarCPF(cliente.cpf);
        document.getElementById("cpfCliente").disabled = true;

        const modalTitle = document.getElementById("modalTitle");
        modalTitle.textContent = "Atualizar Cliente";

        document.getElementById("cpfCliente").dataset.cpf = cliente.cpf;
    }

    const modalFormulario = document.getElementById("modal-formulario");
    modalFormulario.style.display = "block";
}

function filtrarClientes(clientes, termoBusca) {
    termoBusca = termoBusca.toLowerCase().trim();
    const termoBuscaNormalizado = termoBusca
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const clientesFiltrados = clientes.filter((cliente) => {
        const cpfFormatado = cliente.cpf.replace(/[^\d]+/g, "");

        const cpfMatch =
            termoBusca.replace(/\D/g, "") &&
            cpfFormatado.includes(termoBusca.replace(/\D/g, ""));

        const nomeNormalizado = cliente.nome
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const nomeMatch = nomeNormalizado.includes(termoBuscaNormalizado);

        return cpfMatch || nomeMatch;
    });

    return clientesFiltrados;
}

function configurarBusca(clientes) {
    const campoBusca = document.getElementById("campoBusca");

    campoBusca.addEventListener("input", function () {
        const termoBusca = campoBusca.value;
        const clientesFiltrados = filtrarClientes(clientes, termoBusca);
        preencherTabelaClientes(clientesFiltrados);
    });
}

window.onload = function () {
    const formulario = document.getElementById("formNovoCliente");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault();
            validarFormulario();
        });
    }
};

async function validarFormulario() {
    const cpfInput = document.getElementById("cpfCliente");
    const nomeInput = document.getElementById("nomeCliente");
    const emailInput = document.getElementById("emailCliente");
    const telefoneInput = document.getElementById("telefoneCliente");
    const mensagemErro = document.getElementById("mensagem-erro");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();

    const cpfValido = validarCPF();
    const nomeValido = validarNome();
    const emailValido = validarEmail();
    const telefoneValido = validarTelefone();

    if (!cpfValido || !nomeValido || !emailValido || !telefoneValido) {
        exibirErro(
            mensagemErro,
            data.message || "Formulário contém erros de validação."
        );
        return;
    }

    const cpfCliente = cpfInput.dataset.cpf || cpf;

    const dadosCliente = {
        cpf: cpfCliente.replace(/\D/g, ""),
        nome,
        email,
        telefone,
    };

    try {
        const loading = document.getElementById("loading");
        loading.style.display = "block";
        let data;
        if (cpfInput.disabled) {
            data = await atualizarCliente(dadosCliente);
        } else {
            data = await salvarCliente(dadosCliente);
        }
        if (data.success) {
            document.getElementById("cpfCliente").value = "";
            document.getElementById("nomeCliente").value = "";
            document.getElementById("emailCliente").value = "";
            document.getElementById("telefoneCliente").value = "";

            const clientes = await obterClientes();
            preencherTabelaClientes(clientes);
            configurarBusca(clientes);
        } else {
            exibirErro(mensagemErro, data.message || "Erro ao cadastrar.");
        }
    } catch (error) {
        exibirErro(
            mensagemErro,
            error.message || "Erro ao tentar se comunicar com o servidor."
        );
    } finally {
        loading.style.display = "none";
    }
}

function exibirErro(mensagemElemento, mensagem) {
    mensagemElemento.textContent = mensagem;
    mensagemElemento.classList.add("visivel");
}

carregarListaClientes();
