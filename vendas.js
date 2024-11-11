import { validarToken } from "./auth.js";
import {
    obterVendas,
    obterClientes,
    atualizarVenda,
    salvarVenda,
} from "./api.js";

let vendas = [];
let clientes = [];

function fecharModal() {
    const modalFormulario = document.getElementById("modal-formulario");
    modalFormulario.style.display = "none";
}

function carregarClientesselect(clientes) {
    // Preencher o select com os nomes dos clientes
    const selectCliente = document.getElementById("clienteVendaVendaNova");
    selectCliente.innerHTML = ""; // Limpar as opções existentes

    if (!clientes || clientes.length === 0) {
        console.error("Nenhum cliente encontrado");
        return;
    }

    // Adicionar uma opção padrão "Escolha um nome de cliente"
    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "Escolha um nome de cliente";
    +selectCliente.appendChild(optionDefault);

    clientes.forEach((c) => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nome;
        selectCliente.appendChild(option);
    });
}

async function carregarListaVendas() {
    if (!validarToken()) {
        alert("Token inválido ou expirado.");
        return;
    }

    try {
        const loading = document.getElementById("loading");
        const tabelaVendas = document.getElementById("tabelaVendas");
        loading.style.display = "block";

        tabelaVendas.innerHTML = "";

        // Obtém os dados das vendas e clientes
        vendas = await obterVendas();
        clientes = await obterClientes();

        carregarClientesselect(clientes);

        preencherTabelaVendas(vendas, clientes);
    } catch (error) {
        alert("Não foi possível carregar a lista de vendas ou clientes.");
    } finally {
        loading.style.display = "none";
    }
}

function preencherTabelaVendas(vendas, clientes) {
    const tabelaVendas = document.getElementById("tabelaVendas");

    vendas.forEach((venda) => {
        const cliente = clientes.find((c) => c.id === venda.cliente_id);

        if (cliente) {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${formatarData(venda.data)}</td>
        <td>R$ ${venda.valor.toFixed(2)}</td>
        <td>${venda.pendente ? "Pendente" : "Concluída"}</td>
        <td class='campo-tabela'><button class="btn-atualizar" data-id="${venda.id
                }">Atualizar</button></td>
      `;
            tabelaVendas.appendChild(row);
        }
    });

    const botoesAtualizar = document.querySelectorAll(".btn-atualizar");
    botoesAtualizar.forEach((botao) => {
        botao.addEventListener("click", function () {
            const idVenda = this.dataset.id;
            carregarVendaModal(idVenda, clientes, vendas);
        });
    });
}

function carregarVendaModal(idVenda, clientes, vendas) {
    const venda = vendas.find((venda) => venda.id === Number(idVenda));
    if (!venda) {
        return;
    }

    // Encontrar o cliente correspondente
    const cliente = clientes.find((cliente) => cliente.id === venda.cliente_id);
    if (!cliente) {
        return;
    }

    document.getElementById("clienteVendaAtualizacao").value = cliente.nome;
    document.getElementById("dataVendaAtualizacao").value = venda.data;
    document.getElementById("valorVendaAtualizacao").value = venda.valor;

    if (venda.pendente) {
        document.getElementById("statusVendaPendenteSim").checked = true;
    } else {
        document.getElementById("statusVendaPendenteNao").checked = true;
    }

    // Atribuir o idVenda ao formulário (data-id-venda)
    const formAtualizarVenda = document.getElementById("formAtualizarVenda");
    formAtualizarVenda.dataset.idVenda = idVenda;

    // Exibir o modal
    const modalFormulario = document.getElementById("modal-formulario");
    modalFormulario.style.display = "block";
}

function formatarData(data) {
    // Divide a string da data no formato YYYY-MM-DD
    const partes = data.split("-");

    // Organiza a data no formato DD/MM/YYYY
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function filtrarVendasPorCliente() {
    const termoBusca = document.getElementById("campoBusca").value.toLowerCase();
    const vendasFiltradas = vendas.filter((venda) => {
        const cliente = clientes.find((c) => c.id === venda.cliente_id);
        return cliente && cliente.nome.toLowerCase().includes(termoBusca);
    });

    const tabelaVendas = document.getElementById("tabelaVendas");
    tabelaVendas.innerHTML = "";
    preencherTabelaVendas(vendasFiltradas, clientes);
}

const formAtualizarVenda = document.getElementById("formAtualizarVenda");

formAtualizarVenda.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtém o idVenda diretamente do formulário
    const idVenda = Number(formAtualizarVenda.dataset.idVenda); // Agora o idVenda estará acessível

    if (isNaN(idVenda)) {
        alert("ID da venda inválido.");
        return;
    }

    const clienteId = document.getElementById("clienteVendaAtualizacao").value;
    const dataVenda = document.getElementById("dataVendaAtualizacao").value;
    const valorVenda = parseFloat(
        document.getElementById("valorVendaAtualizacao").value
    );
    const pendente = document.getElementById("statusVendaPendenteSim").checked;

    // Validação dos campos
    if (!clienteId || !dataVenda || isNaN(valorVenda)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const dadosVenda = {
        id: idVenda,
        data: dataVenda,
        valor: valorVenda,
        pendente,
    };

    try {
        const loading = document.getElementById("loading");
        loading.style.display = "block";
        const resultado = await atualizarVenda(dadosVenda);

        if (resultado.success) {
            carregarListaVendas();

            fecharModal();
        } else {
            alert(`Erro: ${resultado.message}`);
        }
    } catch (error) {
        alert("Erro ao atualizar a venda. Tente novamente.");
        console.error("Erro ao salvar alterações da venda:", error);
    }
});

document
    .getElementById("formNovaVenda")
    .addEventListener("submit", async function (event) {
        const mensagemErro = document.getElementById("mensagem-erro");
        event.preventDefault();

        // Obtendo os valores dos campos
        const clienteVenda = document.getElementById("clienteVendaVendaNova").value;
        const dataVenda = document.getElementById("dataVenda").value;
        const valorVenda = document.getElementById("valorVenda").value;

        // Validação para verificar se todos os campos estão preenchidos
        if (!clienteVenda || !dataVenda || !valorVenda) {
            exibirErro(mensagemErro, "Todos os campos precisam ser preenchidos!");
            return;
        }

        const venda = {
            cliente_id: clienteVenda,
            data: dataVenda,
            valor: Number(valorVenda),
            pendente: true,
        };

        try {
            const loading = document.getElementById("loading");
            loading.style.display = "block";
            const resultado = await salvarVenda(venda);
            console.log(resultado);
            if (resultado.success) {
                carregarListaVendas();
                document.getElementById("formNovaVenda").reset();
            } else {
                alert(`Erro: ${resultado.message}`);
            }
        } catch (error) { }
    });

// Função para exibir erros no formulário
function exibirErro(mensagemElemento, mensagem) {
    mensagemElemento.textContent = mensagem;
    mensagemElemento.classList.add("visivel");
}

document
    .getElementById("campoBusca")
    .addEventListener("input", filtrarVendasPorCliente);

document.getElementById("fechar-modal").addEventListener("click", fecharModal);

carregarListaVendas();
