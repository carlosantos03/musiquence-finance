let dadosOficiaisPaciente = null; 
let graficoAtual = null; 
let graficoAtual2 = null;

let jogoSelecionado = 'matematica'; 
let nivelSelecionado = 'todos'; 

// ==========================================
// 1. CARREGAR OS DADOS NO INÍCIO
// ==========================================
window.onload = async function() {
    try {
        const sessao = localStorage.getItem('sessaoAtual');
        if (!sessao) return;

        const resposta = await fetch('/api/dados');
        const bdOficial = await resposta.json();

        if (bdOficial[sessao]) {
            dadosOficiaisPaciente = bdOficial[sessao];
            atualizarVisao(); 
        }

    } catch (erro) {
        console.error("Erro ao comunicar com o servidor:", erro);
        const sessao = localStorage.getItem('sessaoAtual');
        const bdLocal = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
        if (sessao && bdLocal[sessao]) {
            dadosOficiaisPaciente = bdLocal[sessao];
            atualizarVisao();
        }
    }
};

// ==========================================
// 2. FUNÇÕES DOS BOTÕES (INTERATIVIDADE)
// ==========================================
// ==========================================
// 2. FUNÇÕES DOS BOTÕES (INTERATIVIDADE)
// ==========================================
window.mudarJogo = function(jogo) {
    jogoSelecionado = jogo;
    atualizarVisao(); 
}

window.mudarNivel = function(nivel) {
    nivelSelecionado = nivel;
    atualizarVisao();
}

// ==========================================
// 3. O MOTOR QUE FILTRA E DESENHA
// ==========================================
function atualizarVisao() {
    if (!dadosOficiaisPaciente) return;

    let tituloFinal = "";
    let historicoBruto = [];
    
    // Configurar Títulos e selecionar o Array certo da BD
    if (jogoSelecionado === 'matematica') {
        let nomeNivel = nivelSelecionado === 'todos' ? 'Todos os Níveis' : (nivelSelecionado === 'facil' ? 'Nível Fácil' : (nivelSelecionado === 'medio' ? 'Nível Médio' : 'Nível Difícil'));
        tituloFinal = `🧠 Ginásio das Contas - ${nomeNivel}`;
        historicoBruto = dadosOficiaisPaciente.historico_matematica;
    } 
    else if (jogoSelecionado === 'moedas') {
        if (nivelSelecionado === 'todos') tituloFinal = `🪙 Moedas/Notas - Todos os Níveis`;
        else if (nivelSelecionado === 'facil') tituloFinal = `🪙 A Carteira (Identificar)`;
        else if (nivelSelecionado === 'medio') tituloFinal = `🐖 O Mealheiro (Somar)`;
        else if (nivelSelecionado === 'dificil') tituloFinal = `🏦 O Cofre (Atingir Valor)`;
        historicoBruto = dadosOficiaisPaciente.historico_moedas;
    }
    else if (jogoSelecionado === 'supermercado') {
        if (nivelSelecionado === 'todos') tituloFinal = `🛒 Supermercado - Todos os Níveis`;
        else if (nivelSelecionado === 'facil') tituloFinal = `🛒 Supermercado - Nível Fácil (1 Prod.)`;
        else if (nivelSelecionado === 'medio') tituloFinal = `🛒 Supermercado - Nível Médio (3 Prod.)`;
        else if (nivelSelecionado === 'dificil') tituloFinal = `🛒 Supermercado - Nível Difícil (5 Prod.)`;
        historicoBruto = dadosOficiaisPaciente.historico_supermercado;
    }
    else if (jogoSelecionado === 'farmacia') {
        if (nivelSelecionado === 'todos') tituloFinal = `💊 Farmácia - Todos os Níveis`;
        else if (nivelSelecionado === 'facil') tituloFinal = `💊 Farmácia - Nível Fácil (1 Prod.)`;
        else if (nivelSelecionado === 'medio') tituloFinal = `💊 Farmácia - Nível Médio (2 Prod.)`;
        else if (nivelSelecionado === 'dificil') tituloFinal = `💊 Farmácia - Nível Difícil (3 Prod.)`;
        historicoBruto = dadosOficiaisPaciente.historico_farmacia;
    }
    else if (jogoSelecionado === 'banco') {
        if (nivelSelecionado === 'todos') tituloFinal = `💳 Multibanco - Todos os Níveis`;
        else if (nivelSelecionado === 'facil') tituloFinal = `💳 Multibanco - Nível 1 - Levantamentos`;
        else if (nivelSelecionado === 'medio') tituloFinal = `💳 Multibanco - Nível 2 - Pagamentos`;
        else if (nivelSelecionado === 'dificil') tituloFinal = `💳 Multibanco - Nível 3 - Transferências`;
        historicoBruto = dadosOficiaisPaciente.historico_banco;
    }
    else if (jogoSelecionado === 'online') {
        if (nivelSelecionado === 'todos') tituloFinal = `💻 Compras Online - Todos os Níveis`;
        else if (nivelSelecionado === 'facil') tituloFinal = `💻 Compras Online - Nível Fácil`;
        else if (nivelSelecionado === 'medio') tituloFinal = `💻 Compras Online - Nível Médio`;
        else if (nivelSelecionado === 'dificil') tituloFinal = `💻 Compras Online - Nível Difícil`;
        historicoBruto = dadosOficiaisPaciente.historico_comprasonline;
    }
    
    document.getElementById('titulo-grafico').innerText = tituloFinal;
    historicoBruto = historicoBruto || [];

    let historicoFiltrado = [];
    if (nivelSelecionado === 'todos') {
        historicoFiltrado = historicoBruto;
    } else {
        historicoFiltrado = historicoBruto.filter(jogo => jogo.nivel === nivelSelecionado);
    }

    // Destruir os gráficos antigos se existirem
    if (graficoAtual) graficoAtual.destroy();
    if (graficoAtual2) graficoAtual2.destroy();

    if (historicoFiltrado.length === 0) {
        document.getElementById('area-graficos').style.display = 'none';
        document.getElementById('msg-sem-dados').style.display = 'block';
        return;
    }

    document.getElementById('msg-sem-dados').style.display = 'none';
    document.getElementById('area-graficos').style.display = 'flex';

    // Agrupar dados por Dia
    const agrupadoPorDia = {};
    historicoFiltrado.forEach(jogo => {
        const diaLimpo = jogo.data.split(',')[0].trim(); 

        if (!agrupadoPorDia[diaLimpo]) {
            agrupadoPorDia[diaLimpo] = { 
                somaTempo: 0, somaErros: 0, 
                somaTempoFat: 0, somaErrosFat: 0,
                quantidadeJogos: 0 
            };
        }

        if (jogoSelecionado === 'supermercado') {
            agrupadoPorDia[diaLimpo].somaTempo += (jogo.tempo_prateleira_segundos || 0);
            agrupadoPorDia[diaLimpo].somaErros += (jogo.erros_prateleira || 0);
            agrupadoPorDia[diaLimpo].somaTempoFat += (jogo.tempo_fatura_segundos || 0);
            agrupadoPorDia[diaLimpo].somaErrosFat += (jogo.erros_fatura || 0);
        } else if (jogoSelecionado === 'farmacia') {
            agrupadoPorDia[diaLimpo].somaTempo += (jogo.tempo_receita_segundos || 0);
            agrupadoPorDia[diaLimpo].somaErros += (jogo.erros_receita || 0);
            agrupadoPorDia[diaLimpo].somaTempoFat += (jogo.tempo_troco_segundos || 0);
            agrupadoPorDia[diaLimpo].somaErrosFat += (jogo.erros_troco || 0);
        } else if (jogoSelecionado === 'online') {
            agrupadoPorDia[diaLimpo].somaTempo += (jogo.tempo_compras_segundos || 0);
            agrupadoPorDia[diaLimpo].somaErros += (jogo.erros_checkout || 0);
        } else {
            agrupadoPorDia[diaLimpo].somaTempo += (jogo.tempo_segundos || 0);
            let errosNesteJogo = jogo.erros !== undefined ? jogo.erros : (jogo.acertou ? 0 : 1);
            agrupadoPorDia[diaLimpo].somaErros += errosNesteJogo;
        }
        
        agrupadoPorDia[diaLimpo].quantidadeJogos += 1;
    });

    const diasOrdenados = Object.keys(agrupadoPorDia).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split('/');
        const [diaB, mesB, anoB] = b.split('/');
        return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
    });

    const labelsDias = [];
    const dadosTempoMedio = [];
    const dadosErroMedio = [];
    const dadosTempoFat = [];
    const dadosErroFat = [];

    diasOrdenados.forEach(dia => {
        labelsDias.push(dia);
        const info = agrupadoPorDia[dia];
        
        dadosTempoMedio.push(Math.round(info.somaTempo / info.quantidadeJogos));
        dadosErroMedio.push((info.somaErros / info.quantidadeJogos).toFixed(1));
        
        if (jogoSelecionado === 'supermercado' || jogoSelecionado === 'farmacia') {
            dadosTempoFat.push(Math.round(info.somaTempoFat / info.quantidadeJogos));
            dadosErroFat.push((info.somaErrosFat / info.quantidadeJogos).toFixed(1));
        }
    });

    if (jogoSelecionado === 'supermercado' || jogoSelecionado === 'farmacia') {
        document.getElementById('titulo-grafico-1').style.display = 'block';
        document.getElementById('contentor-grafico-2').style.display = 'block';
        document.getElementById('contentor-grafico-1').style.width = '48%';
        
        if (jogoSelecionado === 'supermercado') {
            document.getElementById('titulo-grafico-1').innerText = "🔎 Fase 1: Prateleira";
            document.getElementById('titulo-grafico-2').innerText = "🧾 Fase 2: Fatura";
        } else {
            document.getElementById('titulo-grafico-1').innerText = "💊 Fase 1: Receita";
            document.getElementById('titulo-grafico-2').innerText = "💶 Fase 2: Troco";
        }

        graficoAtual = desenharChartJS('graficoDinamico', labelsDias, dadosTempoMedio, dadosErroMedio);
        graficoAtual2 = desenharChartJS('graficoDinamico2', labelsDias, dadosTempoFat, dadosErroFat);
    } else {
        document.getElementById('titulo-grafico-1').style.display = 'none';
        document.getElementById('contentor-grafico-2').style.display = 'none';
        document.getElementById('contentor-grafico-1').style.width = '100%';
        
        graficoAtual = desenharChartJS('graficoDinamico', labelsDias, dadosTempoMedio, dadosErroMedio);
    }
}

function desenharChartJS(canvasId, labels, dadosTempo, dadosErros) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const corTexto = '#F0F8FF'; 

    return new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels, 
            datasets: [
                {
                    label: 'Tempo Médio (Segundos)',
                    data: dadosTempo,
                    borderColor: '#3BA7B1', 
                    backgroundColor: 'rgba(59, 167, 177, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'yTempo',
                    tension: 0.3, 
                    fill: true
                },
                {
                    label: 'Erros Médios',
                    data: dadosErros,
                    borderColor: '#ff7675', // Vermelho para Erros
                    backgroundColor: 'rgba(255, 118, 117, 0.1)',
                    borderWidth: 3,
                    yAxisID: 'yErros',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { 
                    labels: { 
                        font: { size: 16, weight: 'bold' }, 
                        color: corTexto 
                    } 
                }
            },
            scales: {
                x: {
                    ticks: { 
                        font: { size: 14, weight: 'bold' }, 
                        color: corTexto
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                yTempo: {
                    type: 'linear', display: true, position: 'left',
                    title: { display: true, text: 'Segundos ⏱️', font: { size: 16, weight: 'bold' }, color: '#3BA7B1' }, 
                    ticks: { 
                        font: { size: 15, weight: 'bold' }, 
                        color: corTexto 
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    min: 0
                },
                yErros: {
                    type: 'linear', display: true, position: 'right',
                    title: { display: true, text: 'Erros ❌', font: { size: 16, weight: 'bold' }, color: '#ff7675' }, 
                    ticks: { 
                        font: { size: 15, weight: 'bold' }, 
                        color: corTexto 
                    },
                    min: 0,
                    grid: { drawOnChartArea: false } 
                }
            }
        }
    });
}