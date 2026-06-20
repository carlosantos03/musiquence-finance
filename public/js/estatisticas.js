let historicoCompleto = []; // Para a matemática
let historicoMoedasCompleto = []; // Para as moedas
let historicoSupermercadoCompleto = []; // Para o supermercado
let historicoFarmaciaCompleto = []; // Para a farmácia
let historicoBancoCompleto = []; // Para o Banco
let historicoComprasOnlineCompleto = []; // Para as Compras Online

// ==========================================
// MUDAR O JOGO MOSTRADO NO ECRÃ (DROPDOWN)
// ==========================================
window.mostrarEstatisticasJogo = function(jogoId) {
    // 1. Vai buscar todas as caixas de estatística da página e esconde-as
    const caixas = document.querySelectorAll('.caixa-estatisticas');
    caixas.forEach(caixa => {
        caixa.style.display = 'none';
    });

    // 2. Mostra APENAS a caixa que foi selecionada no Dropdown
    const caixaAtiva = document.getElementById(jogoId);
    if(caixaAtiva) {
        caixaAtiva.style.display = 'block';
    }
};

// ==========================================
// 1. CARREGAR OS DADOS OFICIAIS DO SERVIDOR
// ==========================================
window.onload = async function() {
    try {
        const sessao = localStorage.getItem('sessaoAtual');
        
        // Pede a Base de Dados OFICIAL ao teu servidor Node.js
        const resposta = await fetch('/api/dados');
        const bdOficial = await resposta.json();

        // Se não houver ninguém logado ou o paciente não existir na BD
        if (!sessao || !bdOficial[sessao]) {
            document.getElementById('grelha-estatisticas').style.display = 'none';
            document.getElementById('mensagem-sem-dados').style.display = 'block';
            document.getElementById('grelha-estatisticas-moedas').style.display = 'none';
            document.getElementById('mensagem-sem-dados-moedas').style.display = 'block';
            return;
        }

        const dadosDoPaciente = bdOficial[sessao];

        // Processa as duas secções de jogos
        calcularEstatisticas(dadosDoPaciente);         
        carregarEstatisticasMoedas(dadosDoPaciente);  
        carregarEstatisticasSupermercado(dadosDoPaciente); 
        carregarEstatisticasFarmacia(dadosDoPaciente);
        carregarEstatisticasBanco(dadosDoPaciente);
        carregarEstatisticasComprasOnline(dadosDoPaciente);
        
    } catch (erro) {
        console.error("Erro ao comunicar com o servidor:", erro);
        // Fallback: Se o servidor estiver desligado, tenta ler a memória local
        const sessao = localStorage.getItem('sessaoAtual');
        const bdLocal = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
        if (sessao && bdLocal[sessao]) {
            calcularEstatisticas(bdLocal[sessao]);
            carregarEstatisticasMoedas(bdLocal[sessao]);
            carregarEstatisticasSupermercado(bdLocal[sessao]); 
            carregarEstatisticasFarmacia(bdLocal[sessao]);
            carregarEstatisticasBanco(bdLocal[sessao]);
            carregarEstatisticasComprasOnline(bdLocal[sessao]);
        }
    }
};

// ==========================================
// ESTATÍSTICAS: GINÁSIO DAS CONTAS
// ==========================================
function calcularEstatisticas(dados) {
    if (!dados.historico_matematica || dados.historico_matematica.length === 0) {
        document.getElementById('grelha-estatisticas').style.display = 'none';
        document.getElementById('mensagem-sem-dados').style.display = 'block';
        return;
    }

    historicoCompleto = dados.historico_matematica; 

    const jogosFacil = historicoCompleto.filter(jogo => jogo.nivel === 'facil');
    const jogosMedio = historicoCompleto.filter(jogo => jogo.nivel === 'medio');
    const jogosDificil = historicoCompleto.filter(jogo => jogo.nivel === 'dificil');

    atualizarCartao('facil', jogosFacil);
    atualizarCartao('medio', jogosMedio);
    atualizarCartao('dificil', jogosDificil);
}

function atualizarCartao(nivelStr, arrayJogos) {
    if (arrayJogos.length === 0) return;

    const totalJogos = arrayJogos.length;
    let somaTempo = 0;
    let somaErros = 0;
    let totalAcertos = 0;
    let totalContasFeitas = 0;

    arrayJogos.forEach(jogo => {
        let jTotal = jogo.total_contas || (nivelStr === 'facil' ? 3 : (nivelStr === 'medio' ? 4 : 5));
        let jAcertos = jogo.acertos !== undefined ? jogo.acertos : (jTotal - (jogo.erros || 0));

        somaTempo += (jogo.tempo_segundos || 0);
        somaErros += (jogo.erros || 0);
        totalAcertos += jAcertos;
        totalContasFeitas += jTotal;
    });

    const mediaTempo = Math.round(somaTempo / totalJogos);
    const taxaAcerto = totalContasFeitas > 0 ? Math.round((totalAcertos / totalContasFeitas) * 100) : 0;
    const mediaErros = (somaErros / totalJogos).toFixed(1);

    document.getElementById(`stat-${nivelStr}-jogos`).innerText = totalJogos;
    document.getElementById(`stat-${nivelStr}-acerto`).innerText = taxaAcerto + "%";
    document.getElementById(`stat-${nivelStr}-tempo`).innerText = mediaTempo + "s";
    document.getElementById(`stat-${nivelStr}-erros`).innerText = mediaErros;
}

function abrirHistorico(nivel) {
    const jogos = historicoCompleto.filter(jogo => jogo.nivel === nivel);
    if(jogos.length === 0) return; 

    let nomeNivel = "Fácil";
    let corNivel = "#00b894";
    if(nivel === 'medio') { nomeNivel = "Médio"; corNivel = "#fdcb6e"; }
    if(nivel === 'dificil') { nomeNivel = "Difícil"; corNivel = "#d63031"; }

    document.getElementById('titulo-modal').innerText = `Histórico - Nível ${nomeNivel}`;
    document.getElementById('titulo-modal').style.color = corNivel;

    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Tempo</th>
        <th>Erros</th>
        <th>Acertos</th>
    `;

    const tbody = document.getElementById('corpo-tabela-historico');
    tbody.innerHTML = ''; 

    const jogosInvertidos = [...jogos].reverse();

    jogosInvertidos.forEach(jogo => {
        let jTotal = jogo.total_contas || (nivel === 'facil' ? 3 : (nivel === 'medio' ? 4 : 5));
        let jAcertos = jogo.acertos !== undefined ? jogo.acertos : (jTotal - (jogo.erros || 0));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${jogo.data}</td>
            <td>⏱️ ${jogo.tempo_segundos}s</td>
            <td style="color: #d63031; font-weight: bold;">${jogo.erros}</td>
            <td style="color: #00b894; font-weight: bold;">${jAcertos}/${jTotal}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('modal-historico').style.display = 'flex'; 
}

// ==========================================
// ESTATÍSTICAS: JOGO DAS MOEDAS
// ==========================================
function carregarEstatisticasMoedas(dados) {
    if (!dados.historico_moedas || dados.historico_moedas.length === 0) {
        document.getElementById('grelha-estatisticas-moedas').style.display = 'none';
        document.getElementById('mensagem-sem-dados-moedas').style.display = 'block';
        return;
    }

    historicoMoedasCompleto = dados.historico_moedas;

    document.getElementById('grelha-estatisticas-moedas').style.display = 'flex';
    document.getElementById('mensagem-sem-dados-moedas').style.display = 'none';

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        const jogadasNivel = historicoMoedasCompleto.filter(j => j.nivel === nivel);
        
        const totalJogos = jogadasNivel.length;
        if (totalJogos === 0) return; 

        const acertos = jogadasNivel.filter(j => j.acertou).length;
        
        // Conta os erros normais (nível 1 e 2) OU os cliques a mais (nível 3)
        const erros = jogadasNivel.reduce((acc, j) => {
            if (j.erros !== undefined) return acc + j.erros;
            return acc + (j.acertou ? 0 : 1);
        }, 0);

        const taxaAcerto = Math.round((acertos / totalJogos) * 100);
        const somaTempo = jogadasNivel.reduce((acc, jogada) => acc + jogada.tempo_segundos, 0);
        const tempoMedio = Math.round(somaTempo / totalJogos);
        const mediaErrosMoeda = (erros / totalJogos).toFixed(1);

        document.getElementById(`stat-moeda-${nivel}-jogos`).innerText = totalJogos;
        document.getElementById(`stat-moeda-${nivel}-acerto`).innerText = `${taxaAcerto}%`;
        document.getElementById(`stat-moeda-${nivel}-tempo`).innerText = `${tempoMedio}s`;
        document.getElementById(`stat-moeda-${nivel}-erros`).innerText = mediaErrosMoeda;
    });
}

function abrirHistoricoMoedas(nivel) {
    const jogadas = historicoMoedasCompleto.filter(j => j.nivel === nivel).reverse();

    if(jogadas.length === 0) return;

    const titulos = {
        'facil': 'A Carteira (Identificar)',
        'medio': 'O Mealheiro (Somar)',
        'dificil': 'O Cofre (Atingir Valor)'
    };

    document.getElementById('titulo-modal').innerText = `Histórico - ${titulos[nivel]}`;
    document.getElementById('titulo-modal').style.color = "#FFD700"; 

    const corpoTabela = document.getElementById('corpo-tabela-historico');
    corpoTabela.innerHTML = '';

    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Desafio</th>
        <th>Tempo</th>
        <th>Resultado</th>
    `;

    jogadas.forEach(j => {
        const tr = document.createElement('tr');
        
        // Mostra uma mensagem detalhada consoante a quantidade de erros do Cofre
        let textoResultado = j.acertou ? '✅ Perfeito' : (j.erros > 0 ? `❌ ${j.erros} Erro(s)` : '❌ Errou');
        let corResultado = j.acertou ? '#00b894' : '#ff7675';
        
        tr.innerHTML = `
            <td>${j.data}</td>
            <td style="font-weight: bold;">${j.moeda}</td>
            <td>⏱️ ${j.tempo_segundos}s</td>
            <td style="color: ${corResultado}; font-weight: bold;">${textoResultado}</td>
        `;
        corpoTabela.appendChild(tr);
    });

    document.getElementById('modal-historico').style.display = 'flex'; 
}

// ==========================================
// FUNÇÕES GERAIS DO MODAL (Fechar)
// ==========================================
function fecharHistorico() {
    document.getElementById('modal-historico').style.display = 'none';
}

window.onclick = function(evento) {
    const modal = document.getElementById('modal-historico');
    if (evento.target === modal) {
        modal.style.display = "none";
    }
}

function carregarEstatisticasSupermercado(dados) {
    if (!dados.historico_supermercado || dados.historico_supermercado.length === 0) {
        document.getElementById('grelha-estatisticas-super').style.display = 'none';
        document.getElementById('mensagem-sem-dados-super').style.display = 'block';
        return;
    }

    historicoSupermercadoCompleto = dados.historico_supermercado;

    document.getElementById('grelha-estatisticas-super').style.display = 'flex';
    document.getElementById('mensagem-sem-dados-super').style.display = 'none';

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        const jogadas = historicoSupermercadoCompleto.filter(j => j.nivel === nivel);
        
        const totalJogos = jogadas.length;
        if (totalJogos === 0) return; 

        // Separamos a soma dos tempos e dos erros
        let somaTempoPrat = 0;
        let somaTempoFat = 0;
        let somaErrosPrat = 0;
        let somaErrosFat = 0;

        jogadas.forEach(j => {
            somaTempoPrat += (j.tempo_prateleira_segundos || 0);
            somaTempoFat += (j.tempo_fatura_segundos || 0);
            somaErrosPrat += (j.erros_prateleira || 0);
            somaErrosFat += (j.erros_fatura || 0);
        });

        // Calcula as médias individualmente
        const mediaTempoPrat = Math.round(somaTempoPrat / totalJogos);
        const mediaTempoFat = Math.round(somaTempoFat / totalJogos);
        const mediaErrPrat = (somaErrosPrat / totalJogos).toFixed(1);
        const mediaErrFat = (somaErrosFat / totalJogos).toFixed(1);

        // Preenche os campos no ecrã com os novos IDs
        document.getElementById(`stat-super-${nivel}-jogos`).innerText = totalJogos;
        document.getElementById(`stat-super-${nivel}-tempo-prat`).innerText = `${mediaTempoPrat}s`;
        document.getElementById(`stat-super-${nivel}-tempo-fat`).innerText = `${mediaTempoFat}s`;
        document.getElementById(`stat-super-${nivel}-err-prat`).innerText = mediaErrPrat;
        document.getElementById(`stat-super-${nivel}-err-fat`).innerText = mediaErrFat;
    });
}

function abrirHistoricoSupermercado(nivel) {
    const jogadas = historicoSupermercadoCompleto.filter(j => j.nivel === nivel).reverse();

    if(jogadas.length === 0) return;

    const titulos = {
        'facil': 'Fácil (1 Produto)',
        'medio': 'Médio (3 Produtos)',
        'dificil': 'Difícil (5 Produtos)'
    };

    document.getElementById('titulo-modal').innerText = `Histórico - ${titulos[nivel]}`;
    document.getElementById('titulo-modal').style.color = "#ff7675"; // Cor de destaque do super

    const corpoTabela = document.getElementById('corpo-tabela-historico');
    corpoTabela.innerHTML = '';

    // Ajusta o cabeçalho da tabela para refletir as duas métricas
    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Tempo (Prat. + Fat.)</th>
        <th>Erros Prateleira</th>
        <th>Erros Fatura</th>
    `;

    jogadas.forEach(j => {
        const tr = document.createElement('tr');
        
        let corErroPrat = j.erros_prateleira > 0 ? '#d63031' : '#00b894';
        let corErroFat = j.erros_fatura > 0 ? '#d63031' : '#00b894';
        
        tr.innerHTML = `
            <td>${j.data}</td>
            <td>⏱️ ${j.tempo_prateleira_segundos}s + ${j.tempo_fatura_segundos}s</td>
            <td style="color: ${corErroPrat}; font-weight: bold;">${j.erros_prateleira}</td>
            <td style="color: ${corErroFat}; font-weight: bold;">${j.erros_fatura}</td>
        `;
        corpoTabela.appendChild(tr);
    });

    document.getElementById('modal-historico').style.display = 'flex'; 
}
// ==========================================
// ESTATÍSTICAS: FARMÁCIA (RECEITA + TROCO)
// ==========================================
function carregarEstatisticasFarmacia(dados) {
    if (!dados.historico_farmacia || dados.historico_farmacia.length === 0) {
        document.getElementById('grelha-estatisticas-farmacia').style.display = 'none';
        document.getElementById('mensagem-sem-dados-farmacia').style.display = 'block';
        return;
    }

    historicoFarmaciaCompleto = dados.historico_farmacia;
    document.getElementById('grelha-estatisticas-farmacia').style.display = 'flex';
    document.getElementById('mensagem-sem-dados-farmacia').style.display = 'none';

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        const jogadas = historicoFarmaciaCompleto.filter(j => j.nivel === nivel);
        const totalJogos = jogadas.length;
        if (totalJogos === 0) return;

        let somaTempoReceita = 0;
        let somaTempoTroco = 0;
        let somaErrosReceita = 0;
        let somaErrosTroco = 0;

        jogadas.forEach(j => {
            somaTempoReceita += (j.tempo_receita_segundos || 0);
            somaTempoTroco += (j.tempo_troco_segundos || 0);
            somaErrosReceita += (j.erros_receita || 0);
            somaErrosTroco += (j.erros_troco || 0);
        });

        const mediaTempoRec = Math.round(somaTempoReceita / totalJogos);
        const mediaTempoTroco = Math.round(somaTempoTroco / totalJogos);
        const mediaErrRec = (somaErrosReceita / totalJogos).toFixed(1);
        const mediaErrTroco = (somaErrosTroco / totalJogos).toFixed(1);

        document.getElementById(`stat-farm-${nivel}-jogos`).innerText = totalJogos;
        document.getElementById(`stat-farm-${nivel}-tempo-rec`).innerText = `${mediaTempoRec}s`;
        document.getElementById(`stat-farm-${nivel}-tempo-troco`).innerText = `${mediaTempoTroco}s`;
        document.getElementById(`stat-farm-${nivel}-err-rec`).innerText = mediaErrRec;
        document.getElementById(`stat-farm-${nivel}-err-troco`).innerText = mediaErrTroco;
    });
}

function abrirHistoricoFarmacia(nivel) {
    const jogadas = historicoFarmaciaCompleto.filter(j => j.nivel === nivel).reverse();
    if(jogadas.length === 0) return;

    document.getElementById('titulo-modal').innerText = `Histórico Farmácia - Nível ${nivel.toUpperCase()}`;
    document.getElementById('titulo-modal').style.color = "#00cec9"; 

    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Tempo (Rec. + Troco)</th>
        <th>Erros Receita</th>
        <th>Erros Troco</th>
    `;

    const corpoTabela = document.getElementById('corpo-tabela-historico');
    corpoTabela.innerHTML = '';

    jogadas.forEach(j => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${j.data}</td>
            <td>⏱️ ${j.tempo_receita_segundos}s + ${j.tempo_troco_segundos}s</td>
            <td style="color: ${j.erros_receita > 0 ? '#d63031' : '#00b894'}; font-weight: bold;">${j.erros_receita}</td>
            <td style="color: ${j.erros_troco > 0 ? '#d63031' : '#00b894'}; font-weight: bold;">${j.erros_troco}</td>
        `;
        corpoTabela.appendChild(tr);
    });
    document.getElementById('modal-historico').style.display = 'flex';
}

// ==========================================
// ESTATÍSTICAS: O BANCO (MULTIBANCO)
// ==========================================
function carregarEstatisticasBanco(dados) {
    if (!dados.historico_banco || dados.historico_banco.length === 0) {
        document.getElementById('grelha-estatisticas-banco').style.display = 'none';
        document.getElementById('mensagem-sem-dados-banco').style.display = 'block';
        return;
    }

    historicoBancoCompleto = dados.historico_banco;
    document.getElementById('grelha-estatisticas-banco').style.display = 'flex';
    document.getElementById('mensagem-sem-dados-banco').style.display = 'none';

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        const jogadas = historicoBancoCompleto.filter(j => j.nivel === nivel);
        const totalJogos = jogadas.length;
        
        if (totalJogos === 0) return;

        let somaTempo = 0;
        let somaErros = 0;

        jogadas.forEach(j => {
            somaTempo += (j.tempo_segundos || 0);
            somaErros += (j.erros || 0);
        });

        const mediaTempo = Math.round(somaTempo / totalJogos);
        const mediaErros = (somaErros / totalJogos).toFixed(1);

        document.getElementById(`stat-banco-${nivel}-jogos`).innerText = totalJogos;
        document.getElementById(`stat-banco-${nivel}-tempo`).innerText = `${mediaTempo}s`;
        document.getElementById(`stat-banco-${nivel}-erros`).innerText = mediaErros;
    });
}

function abrirHistoricoBanco(nivel) {
    const jogadas = historicoBancoCompleto.filter(j => j.nivel === nivel).reverse();
    if(jogadas.length === 0) return;

    let nomeNivel = "Fácil";
    if(nivel === 'medio') nomeNivel = "Médio";
    if(nivel === 'dificil') nomeNivel = "Difícil";

    document.getElementById('titulo-modal').innerText = `Histórico Multibanco - Nível ${nomeNivel}`;
    document.getElementById('titulo-modal').style.color = "#0984e3"; 

    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Operação</th>
        <th>Tempo</th>
        <th>Erros</th>
    `;

    const corpoTabela = document.getElementById('corpo-tabela-historico');
    corpoTabela.innerHTML = '';

    jogadas.forEach(j => {
        const tr = document.createElement('tr');
        
        // Fica vermelho se teve erros, verde se foi perfeito
        let corErro = j.erros > 0 ? '#d63031' : '#00b894';
        
        tr.innerHTML = `
            <td>${j.data}</td>
            <td style="font-weight: bold;">${j.operacao}</td>
            <td>⏱️ ${j.tempo_segundos}s</td>
            <td style="color: ${corErro}; font-weight: bold;">${j.erros}</td>
        `;
        corpoTabela.appendChild(tr);
    });
    
    document.getElementById('modal-historico').style.display = 'flex';
}

// ==========================================
// ESTATÍSTICAS: COMPRAS ONLINE
// ==========================================
function carregarEstatisticasComprasOnline(dados) {
    if (!dados.historico_comprasonline || dados.historico_comprasonline.length === 0) {
        document.getElementById('grelha-estatisticas-online').style.display = 'none';
        document.getElementById('mensagem-sem-dados-online').style.display = 'block';
        return;
    }

    historicoComprasOnlineCompleto = dados.historico_comprasonline;
    document.getElementById('grelha-estatisticas-online').style.display = 'flex';
    document.getElementById('mensagem-sem-dados-online').style.display = 'none';

    ['facil', 'medio', 'dificil'].forEach(nivel => {
        const jogadas = historicoComprasOnlineCompleto.filter(j => j.nivel === nivel);
        const totalJogos = jogadas.length;
        
        if (totalJogos === 0) return;

        let somaTempo = 0;
        let somaErros = 0;

        jogadas.forEach(j => {
            somaTempo += (j.tempo_compras_segundos || 0);
            somaErros += (j.erros_checkout || 0);
        });

        const mediaTempo = Math.round(somaTempo / totalJogos);
        const mediaErros = (somaErros / totalJogos).toFixed(1);

        document.getElementById(`stat-online-${nivel}-jogos`).innerText = totalJogos;
        document.getElementById(`stat-online-${nivel}-tempo`).innerText = `${mediaTempo}s`;
        document.getElementById(`stat-online-${nivel}-erros`).innerText = mediaErros;
    });
}

function abrirHistoricoComprasOnline(nivel) {
    const jogadas = historicoComprasOnlineCompleto.filter(j => j.nivel === nivel).reverse();
    if(jogadas.length === 0) return;

    let nomeNivel = "Fácil";
    if(nivel === 'medio') nomeNivel = "Médio";
    if(nivel === 'dificil') nomeNivel = "Difícil";

    document.getElementById('titulo-modal').innerText = `Histórico Compras Online - Nível ${nomeNivel}`;
    document.getElementById('titulo-modal').style.color = "#e84393"; 

    const cabecalho = document.querySelector('#tabela-historico thead tr');
    cabecalho.innerHTML = `
        <th>Data e Hora</th>
        <th>Tempo do Checkout</th>
        <th>Erros Cometidos</th>
    `;

    const corpoTabela = document.getElementById('corpo-tabela-historico');
    corpoTabela.innerHTML = '';

    jogadas.forEach(j => {
        const tr = document.createElement('tr');
        
        // Fica vermelho se teve erros, verde se não teve erros (0)
        let corErro = j.erros_checkout > 0 ? '#d63031' : '#00b894';
        
        tr.innerHTML = `
            <td>${j.data}</td>
            <td>⏱️ ${j.tempo_compras_segundos}s</td>
            <td style="color: ${corErro}; font-weight: bold;">${j.erros_checkout}</td>
        `;
        corpoTabela.appendChild(tr);
    });
    
    document.getElementById('modal-historico').style.display = 'flex';
}