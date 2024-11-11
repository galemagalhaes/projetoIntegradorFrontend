function atualizarDashboard() {
    document.getElementById('totalClientes').innerText = totalClientes;
    document.getElementById('totalVendas').innerText = totalVendas;
    document.getElementById('receitaTotal').innerText = `R$ ${receitaTotal.toFixed(2)}`;
    document.getElementById('vendasPendentes').innerText = vendasPendentes;
}

function atualizarGrafico(mes, valor) {
    vendasPorMesDados[mes] += valor;
    vendasPorMes.update();
}

document.getElementById('formNovoCliente').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nomeCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;

    const novaLinha = `<tr>
                <td>${nome}</td>
                <td>${email}</td>
                <td>${telefone}</td>
                <td>N/A</td>
                <td>Pendente</td>
                <td>N/A</td>
            </tr>`;

    document.getElementById('tabelaClientes').insertAdjacentHTML('beforeend', novaLinha);

    totalClientes++;
    atualizarDashboard();

    document.getElementById('formNovoCliente').reset();
});

document.getElementById('formNovaVenda').addEventListener('submit', function (event) {
    event.preventDefault();

    const cliente = document.getElementById('clienteVenda').value;
    const data = new Date(document.getElementById('dataVenda').value);
    const valor = parseFloat(document.getElementById('valorVenda').value);

    const mes = data.getMonth();

    const novaLinhaVenda = `<tr>
                <td>#${proximoIdVenda}</td> <!-- Usando o ID em ordem crescente -->
                <td>${cliente}</td>
                <td>${data.toLocaleDateString('pt-BR')}</td>
                <td>R$ ${valor.toFixed(2)}</td>
                <td>Pendente</td>
            </tr>`;

    document.getElementById('tabelaVendas').insertAdjacentHTML('beforeend', novaLinhaVenda);

    totalVendas++;
    receitaTotal += valor;
    vendasPendentes++;

    atualizarDashboard();
    atualizarGrafico(mes, valor);

    atualizarCliente(cliente, valor, data);

    proximoIdVenda++;
    document.getElementById('formNovaVenda').reset();
});


function atualizarCliente(clienteNome, valor, data) {
    const tabelaClientes = document.getElementById('tabelaClientes');
    const linhas = tabelaClientes.getElementsByTagName('tr');
    let clienteEncontrado = false;

    for (let i = 0; i < linhas.length; i++) {
        const tds = linhas[i].getElementsByTagName('td');
        if (tds[0].innerText === clienteNome) {
            tds[3].innerText = data.toLocaleDateString('pt-BR');
            tds[5].innerText = `R$ ${valor.toFixed(2)}`;
            clienteEncontrado = true;
            break;
        }
    }

    if (!clienteEncontrado) {
        alert('Cliente não encontrado.');
    }
}

document.getElementById('btnLogout').addEventListener('click', function () {
    alert('Deslogado com sucesso!');
    window.location.href = 'index.html';
});