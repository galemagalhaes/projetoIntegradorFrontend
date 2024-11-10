import { obterDashboard } from "./api.js";

async function carregarDashboard() {
    try {
        const dados = await obterDashboard();
        document.getElementById("totalClientes").innerText = dados.total_clients;
        document.getElementById("totalVendas").innerText = dados.total_vendas_mes;
        document.getElementById(
            "receitaTotal"
        ).innerText = `R$ ${dados.receita_mes_atual.toFixed(2)}`;
        document.getElementById("vendasPendentes").innerText =
            dados.total_vendas_pendentes;

        inicializarGrafico(dados.grafico);
    } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
    }
}

function inicializarGrafico(dadosGrafico) {
    if (Array.isArray(dadosGrafico) && dadosGrafico.length > 0) {
        dadosGrafico.sort((a, b) => a.ano - b.ano || a.mes - b.mes);

        const ultimos12Meses = dadosGrafico.slice(-12);

        const labels = ultimos12Meses.map((item) => {
            const nomeMes = [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez",
            ];
            const anoAbreviado = item.ano.toString().slice(-2);
            return `${nomeMes[item.mes - 1]} ${anoAbreviado}`;
        });

        const receitas = ultimos12Meses.map((item) => item.receita);

        const ctx = document.getElementById("vendasPorMes").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Receita por Mês",
                        data: receitas,
                        backgroundColor: "#00ff88",
                        borderColor: "#00ff88",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        console.error(
            "Dados do gráfico não encontrados ou inválidos:",
            dadosGrafico
        );
    }
}

carregarDashboard();
