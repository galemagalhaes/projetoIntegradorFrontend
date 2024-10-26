let totalClientes = 0;
let totalVendas = 0;
let receitaTotal = 0;
let vendasPendentes = 0;
let proximoIdVenda = 1; // Inicia o ID da venda em 1


function validarLogin(){
    var usuario = document.getElementById("usuario");
    var senha = document.getElementById("senha");

    if(usuario.value == "" ){
        alert("Informe o nome de usuário.");
        return false;
    }  if (senha.value == "") {
        alert("Informe a senha.");
        return false;

    } else {
        window.location.href="dashboard.html"
    }
}

function validarCadastro(){

    var usuarioCadastro = document.getElementById("usuarioCadastro").value;
    var senhaCadastro = document.getElementById("senhaCadastro").value;
    var confirmarSenha = document.getElementById("confirmarSenha").value;


    if(usuarioCadastro.value == "" || senhaCadastro.value == "" || confirmarSenha == "") {
        alert("Preencha todos os campos.");
        return false;
        
    } if(senhaCadastro !== confirmarSenha){
        alert("As senhas não conferem.");
        return false;

    } else {
        alert("Cadastro realizado com sucesso!")
        window.location.href ="index.html";
        return true
    }


}



// Dados do gráfico
const vendasPorMesDados = Array(12).fill(0); // Inicializa os dados do gráfico com zeros

const ctx = document.getElementById('vendasPorMes').getContext('2d');
const vendasPorMes = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Vendas',
            data: vendasPorMesDados,
            backgroundColor: '#00ff88',
            borderColor: '#00ff88',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Atualiza os totais na dashboard
function atualizarDashboard() {
    document.getElementById('totalClientes').innerText = totalClientes;
    document.getElementById('totalVendas').innerText = totalVendas;
    document.getElementById('receitaTotal').innerText = `R$ ${receitaTotal.toFixed(2)}`;
    document.getElementById('vendasPendentes').innerText = vendasPendentes;
}

// Atualiza os dados do gráfico
function atualizarGrafico(mes, valor) {
    vendasPorMesDados[mes] += valor; // Adiciona o valor ao mês correspondente
    vendasPorMes.update(); // Atualiza o gráfico
}

// Função para adicionar novo cliente
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

// Função para adicionar nova venda
document.getElementById('formNovaVenda').addEventListener('submit', function (event) {
    event.preventDefault();

    const cliente = document.getElementById('clienteVenda').value;
    const data = new Date(document.getElementById('dataVenda').value);
    const valor = parseFloat(document.getElementById('valorVenda').value);

    const mes = data.getMonth(); // Obtém o mês da venda (0-11)

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
    atualizarGrafico(mes, valor); // Atualiza o gráfico com a nova venda

    atualizarCliente(cliente, valor, data); // Atualiza o cliente com valor e data da última compra

    proximoIdVenda++; // Incrementa o ID da próxima venda
    document.getElementById('formNovaVenda').reset();
});

// Função para atualizar informações do cliente
function atualizarCliente(clienteNome, valor, data) {
    const tabelaClientes = document.getElementById('tabelaClientes');
    const linhas = tabelaClientes.getElementsByTagName('tr');
    let clienteEncontrado = false;

    for (let i = 0; i < linhas.length; i++) {
        const tds = linhas[i].getElementsByTagName('td');
        if (tds[0].innerText === clienteNome) { // Verifica se o cliente corresponde
            tds[3].innerText = data.toLocaleDateString('pt-BR'); // Atualiza a Última Compra
            tds[5].innerText = `R$ ${valor.toFixed(2)}`; // Atualiza o Valor da Última Compra
            clienteEncontrado = true;
            break; // Sai do loop após encontrar o cliente
        }
    }

    if (!clienteEncontrado) {
        alert('Cliente não encontrado.'); // Mensagem de erro se o cliente não existir
    }
}

document.getElementById('btnLogout').addEventListener('click', function() {
    alert('Deslogado com sucesso!');
    // Redirecionar para a página de login ou inicial
    window.location.href = 'index.html'; 
});