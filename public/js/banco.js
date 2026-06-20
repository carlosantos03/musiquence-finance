// ==========================================
// 0. GERADORES DE DADOS ALEATÓRIOS
// ==========================================
const util = {
    gerarNumeros: (qtd) => {
        let res = "";
        for(let i=0; i<qtd; i++) res += Math.floor(Math.random() * 10);
        return res;
    },
    escolher: (lista) => lista[Math.floor(Math.random() * lista.length)],
    gerarTelemovel: () => "9" + Math.floor(Math.random() * 8) + Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
};

let missaoAtiva = {
    pin: "",
    valorCents: 0,
    entidade: "",
    referencia: "",
    tipoPagamento: "", 
    iban: "",
    telemovel: "",
    objetivo: "",
    modoDificil: "" 
};

// ==========================================
// 1. VARIÁVEIS GERAIS DO JOGO
// ==========================================
let nivelAtual = 'facil';
let tempoInicioOperacao;
let tempoFimOperacao;
let errosOperacao = 0;

let estadoVisor = ''; 
let faseAtual = 'boas_vindas'; 

// ==========================================
// 2. NAVEGAÇÃO ENTRE ECRÃS
// ==========================================
window.voltarAoMenuDificuldade = function() {
    document.getElementById('ecra-niveis').style.display = 'block';
    document.getElementById('ecra-banco').style.display = 'none';
}

window.escolherNivel = function(nivel) {
    nivelAtual = nivel;
    
    document.getElementById('ecra-niveis').style.display = 'none';
    document.getElementById('ecra-banco').style.display = 'block';
    
    const etiqueta = document.getElementById('etiqueta-nivel-banco');
    if (nivel === 'facil') { 
        etiqueta.innerText = 'Nível 1: Levantar Dinheiro'; 
        etiqueta.style.background = '#00b894'; 
    } else if (nivel === 'medio') { 
        etiqueta.innerText = 'Nível 2: Pagamentos'; 
        etiqueta.style.background = '#fdcb6e'; 
    } else if (nivel === 'dificil') { 
        etiqueta.innerText = 'Nível 3: Transferências'; 
        etiqueta.style.background = '#d63031'; 
    }

    iniciarMultibanco();
}

// ==========================================
// 3. INICIAR A MÁQUINA E AS MISSÕES
// ==========================================
window.iniciarMultibanco = function() {
    errosOperacao = 0;
    estadoVisor = '';
    faseAtual = 'boas_vindas';
    tempoInicioOperacao = new Date();

    const btnMudarNivel = document.querySelector('.coluna-esquerda .btn-voltar-lateral');
    if(btnMudarNivel) btnMudarNivel.style.display = 'block';

    // 1. Gerar Dados Aleatórios
    missaoAtiva.pin = util.gerarNumeros(4);
    
    // NÍVEL FÁCIL
    const valoresFacil = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    const locaisFacil = ["ir ao Supermercado", "ir à Farmácia", "fazer compras no Shopping", "comprar o jornal", "ir à padaria"];

    missaoAtiva.valorCents = util.escolher(valoresFacil) * 100;
    missaoAtiva.objetivo = util.escolher(locaisFacil);

    // NÍVEL MÉDIO 
    const tiposMedio = [
        { nome: 'Água', entidade: '11223' },
        { nome: 'Luz', entidade: '21550' },
        { nome: 'Telefone', entidade: '10245' }
    ];
    const escolhaMedio = util.escolher(tiposMedio);
    missaoAtiva.tipoPagamento = escolhaMedio.nome;
    missaoAtiva.entidade = escolhaMedio.entidade;
    missaoAtiva.referencia = util.gerarNumeros(9);
    missaoAtiva.valorMedioCents = (Math.floor(Math.random() * 40) + 10) * 100 + (util.escolher([0, 50, 90, 25]));

    // NÍVEL DIFÍCIL
    missaoAtiva.modoDificil = util.escolher(['transferencia', 'mbway']);
    missaoAtiva.iban = util.gerarNumeros(21);
    missaoAtiva.telemovel = util.gerarTelemovel();

    // 2. Atualizar a Missão no Ecrã Lateral
    const missaoTexto = document.getElementById('missao-texto');
    let htmlMissao = `O seu PIN é: <strong style="color:#0984e3; font-size:1.6rem;">${missaoAtiva.pin}</strong><hr>`;

    if (nivelAtual === 'facil') {
        htmlMissao += `Precisa de dinheiro para <strong>${missaoAtiva.objetivo}</strong>.<br><br>Levante <strong>${missaoAtiva.valorCents/100}€</strong>.`;
    } 
    else if (nivelAtual === 'medio') {
        htmlMissao += `Tem uma conta de <strong>${missaoAtiva.tipoPagamento}</strong> para pagar.<br><br>
            Entidade: <strong style="font-size:1.4rem;">${missaoAtiva.entidade}</strong><br>
            Ref: <strong style="font-size:1.4rem;">${missaoAtiva.referencia.replace(/(.{3})/g, '$1 ')}</strong><br>
            Valor: <strong style="font-size:1.4rem;">${(missaoAtiva.valorMedioCents/100).toFixed(2).replace('.', ',')}€</strong>`;
    } 
    else if (nivelAtual === 'dificil') {
        if(missaoAtiva.modoDificil === 'transferencia') {
            htmlMissao += `Faça uma Transferência para o IBAN:<br><strong style="font-size:1.1rem; color:#0984e3;">PT50 ${missaoAtiva.iban.replace(/(.{4})/g, '$1 ')}</strong><br><br>Valor: <strong>50,00€</strong>`;
        } else {
            htmlMissao += `Faça um envio por MB WAY para o contacto:<br><strong style="font-size:1.8rem; color:#d63031;">${missaoAtiva.telemovel.replace(/(.{3})/g, '$1 ')}</strong><br><br>Valor: <strong>20,00€</strong>`;
        }
    }
    missaoTexto.innerHTML = htmlMissao;

    // 3. Reset do Ecrã do Multibanco
    document.getElementById('mb-texto-visor').innerText = "Bem-vindo ao Multibanco\n\nPor favor, insira o seu cartão.";
    document.getElementById('mb-texto-visor').style.color = "#f5f6fa";
    document.getElementById('mb-input-visor').style.display = 'none';
    
    const ranhuraCartao = document.getElementById('saida-cartao');
    ranhuraCartao.innerHTML = ''; 

    const menu = document.getElementById('mb-menu-opcoes');
    menu.style.display = 'flex';
    menu.style.justifyContent = 'center';
    menu.innerHTML = `<button class="mb-btn-ecra" style="text-align: center; font-size: 1.6rem; padding: 15px 30px;" onclick="simularInserirCartao()">💳 Inserir Cartão</button>`;
};

// ==========================================
// 3.1. AÇÃO: INSERIR O CARTÃO
// ==========================================
window.simularInserirCartao = function() {
    const textoVisor = document.getElementById('mb-texto-visor');
    const menu = document.getElementById('mb-menu-opcoes');
    
    menu.innerHTML = '';
    
    const btnMudarNivel = document.querySelector('.coluna-esquerda .btn-voltar-lateral');
    if(btnMudarNivel) btnMudarNivel.style.display = 'none';

    const ranhuraCartao = document.getElementById('saida-cartao');
    ranhuraCartao.innerHTML = '<div id="cartao-cliente" class="mb-cartao-fisico"></div>';

    textoVisor.innerText = "A ler o cartão...\nPor favor aguarde.";
    textoVisor.style.color = "#f5f6fa";

    setTimeout(() => {
        document.getElementById('cartao-cliente').classList.add('cartao-entrou');
    }, 100);

    setTimeout(() => {
        faseAtual = 'inserir_pin';
        textoVisor.innerText = "Introduza o seu Código Secreto (PIN)\ne prima a tecla verde CONFIRMAR";
        textoVisor.style.color = "#f5f6fa";
        document.getElementById('mb-input-visor').style.display = 'block';
        atualizarVisorInteligente();
    }, 1500);
};

// ==========================================
// 4. LÓGICA DO TECLADO FÍSICO
// ==========================================
window.inserirNumero = function(num) {
    if (faseAtual === 'inserir_pin' && estadoVisor.length < 4) estadoVisor += num;
    else if (faseAtual === 'inserir_entidade' && estadoVisor.length < 5) estadoVisor += num;
    else if (faseAtual === 'inserir_referencia' && estadoVisor.length < 9) estadoVisor += num;
    else if (faseAtual === 'inserir_montante' && estadoVisor.length < 5) estadoVisor += num;
    else if (faseAtual === 'inserir_iban' && estadoVisor.length < 21) estadoVisor += num;
    else if (faseAtual === 'inserir_telemovel' && estadoVisor.length < 9) estadoVisor += num;
    else return;

    atualizarVisorInteligente();
};

function atualizarVisorInteligente(tituloNovo = null) {
    if (tituloNovo) {
        document.getElementById('mb-texto-visor').innerText = tituloNovo;
        document.getElementById('mb-texto-visor').style.color = "#f5f6fa";
    }

    let display = estadoVisor;
    
    if (faseAtual === 'inserir_pin') display = '*'.repeat(estadoVisor.length);
    else if (faseAtual === 'inserir_referencia') display = estadoVisor.replace(/(.{3})/g, '$1 ').trim();
    else if (faseAtual === 'inserir_montante') {
        if(estadoVisor.length === 0) display = "0,00";
        else if(estadoVisor.length === 1) display = "0,0" + estadoVisor;
        else if(estadoVisor.length === 2) display = "0," + estadoVisor;
        else display = estadoVisor.slice(0, -2) + "," + estadoVisor.slice(-2);
        display += " EUR";
    } 
    else if (faseAtual === 'inserir_iban') display = "PT50 " + estadoVisor.replace(/(.{4})/g, '$1 ').trim();

    document.getElementById('mb-input-visor').innerText = display || "_";
}

window.teclaCorrigir = function() {
    if (estadoVisor.length > 0) {
        estadoVisor = estadoVisor.slice(0, -1);
        atualizarVisorInteligente();
    }
};

window.teclaAnular = function() {
    if (faseAtual === 'boas_vindas' || faseAtual === 'sucesso') return;
    
    const cartao = document.getElementById('cartao-cliente');
    if(cartao) cartao.classList.remove('cartao-entrou');
    
    setTimeout(() => { iniciarMultibanco(); }, 800);
};

function erroTeclado(mensagemErro) {
    errosOperacao++;
    const textoVisor = document.getElementById('mb-texto-visor');
    const textoAntigo = textoVisor.innerText;
    
    textoVisor.innerText = `❌ Incorreto:\n${mensagemErro}`;
    textoVisor.style.color = "#ff7675";
    estadoVisor = ''; 
    atualizarVisorInteligente();

    setTimeout(() => {
        textoVisor.innerText = textoAntigo;
        textoVisor.style.color = "#f5f6fa";
    }, 2000);
}

// ==========================================
// 5. O BOTÃO VERDE E A VALIDAÇÃO DOS PASSOS
// ==========================================
window.teclaConfirmar = function() {
    
    if (faseAtual === 'inserir_pin') {
        if (estadoVisor === missaoAtiva.pin) { estadoVisor = ''; abrirMenuPrincipal(); }
        else { erroTeclado("O PIN está errado."); }
    }
    else if (faseAtual === 'inserir_entidade') {
        if (estadoVisor === missaoAtiva.entidade) {
            estadoVisor = ''; faseAtual = 'inserir_referencia';
            atualizarVisorInteligente("Introduza a Referência\ne prima CONFIRMAR");
        } else { erroTeclado("A Entidade não corresponde à fatura."); }
    }
    else if (faseAtual === 'inserir_referencia') {
        if (estadoVisor === missaoAtiva.referencia) {
            estadoVisor = ''; faseAtual = 'inserir_montante';
            atualizarVisorInteligente("Introduza o Montante (ex: 8000 para 80 EUR)\ne prima CONFIRMAR");
        } else { erroTeclado("A Referência não está correta."); }
    }
    else if (faseAtual === 'inserir_montante') {
        let valorEsperado = (nivelAtual === 'facil') ? (missaoAtiva.valorCents).toString() :
                            (nivelAtual === 'medio') ? missaoAtiva.valorMedioCents.toString() : 
                            (missaoAtiva.modoDificil === 'mbway' ? '2000' : '5000');
                            
        if (estadoVisor === valorEsperado) { finalizarOperacao(); }
        else { erroTeclado("O montante não corresponde à tarefa."); }
    }
    else if (faseAtual === 'inserir_iban') {
        if (estadoVisor === missaoAtiva.iban) {
            estadoVisor = ''; faseAtual = 'inserir_montante';
            atualizarVisorInteligente("Introduza o Montante (ex: 8000 para 80 EUR)\ne prima CONFIRMAR");
        } else { erroTeclado("O IBAN não está correto."); }
    }
    else if (faseAtual === 'inserir_telemovel') {
        if (estadoVisor === missaoAtiva.telemovel) {
            estadoVisor = ''; faseAtual = 'inserir_montante';
            atualizarVisorInteligente("Introduza o Montante (ex: 8000 para 80 EUR)\ne prima CONFIRMAR");
        } else { erroTeclado("O número de telemóvel não está correto."); }
    }
};

// ==========================================
// 6. MENUS E BOTÕES DO ECRÃ
// ==========================================
function abrirMenuPrincipal() {
    faseAtual = 'menu_principal';
    document.getElementById('mb-input-visor').style.display = 'none'; 
    const menu = document.getElementById('mb-menu-opcoes');
    
    document.getElementById('mb-texto-visor').innerText = "Selecione a operação desejada:";
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '8px';
    
    menu.innerHTML = `
        <button class="mb-btn-ecra" onclick="validarEscolhaMenu('levantamentos')">Levantamentos</button>
        <button class="mb-btn-ecra" onclick="validarEscolhaMenu('pagamentos')">Pagamento de Contas</button>
        <button class="mb-btn-ecra" onclick="validarEscolhaMenu('transferencias')">Transferências</button>
        <button class="mb-btn-ecra" onclick="validarEscolhaMenu('consultas')">Consultas</button>
    `;
}

window.validarEscolhaMenu = function(opcaoEscolhida) {
    if (opcaoEscolhida === 'consultas') {
        return erroTeclado("Esta opção não é necessária para a sua tarefa.");
    }

    if (nivelAtual === 'facil' && opcaoEscolhida !== 'levantamentos') {
        return erroTeclado("Para esta tarefa escolha 'Levantamentos'.");
    }
    if (nivelAtual === 'medio' && opcaoEscolhida !== 'pagamentos') {
        return erroTeclado("Para esta tarefa escolha 'Pagamento de Contas'.");
    }
    if (nivelAtual === 'dificil' && opcaoEscolhida !== 'transferencias') {
        return erroTeclado("Para esta tarefa escolha 'Transferências'.");
    }

    const menu = document.getElementById('mb-menu-opcoes');

    // --- Sub-menu de Levantamentos ---
    if (opcaoEscolhida === 'levantamentos') {
        document.getElementById('mb-texto-visor').innerText = "Selecione o montante a levantar:";
        menu.innerHTML = `
            <div style="display: flex; justify-content: space-between; gap: 8px;">
                <div style="display: flex; flex-direction: column; gap: 8px; width: 48%;">
                    <button class="mb-btn-ecra" onclick="validarBotaoLevantamento(20)">20 EUR</button>
                    <button class="mb-btn-ecra" onclick="validarBotaoLevantamento(40)">40 EUR</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; width: 48%;">
                    <button class="mb-btn-ecra" style="text-align: right;" onclick="validarBotaoLevantamento(60)">60 EUR</button>
                    <button class="mb-btn-ecra" style="text-align: right;" onclick="validarBotaoLevantamento(100)">100 EUR</button>
                </div>
            </div>
            <button class="mb-btn-ecra" style="margin-top: 8px; text-align: center;" onclick="iniciarInput('inserir_montante', 'Introduza o Montante (ex: 8000 para 80 EUR)\\ne prima CONFIRMAR')">Outras Importâncias</button>
        `;
    } 
    // --- Sub-menu de Pagamentos ---
    else if (opcaoEscolhida === 'pagamentos') {
        document.getElementById('mb-texto-visor').innerText = "Selecione a conta a pagar:";
        menu.innerHTML = `
            <button class="mb-btn-ecra" onclick="validarSubMenuPagamento('Luz')">Luz</button>
            <button class="mb-btn-ecra" onclick="validarSubMenuPagamento('Água')">Água</button>
            <button class="mb-btn-ecra" onclick="validarSubMenuPagamento('Telefone')">Telefone</button>
        `;
    }
    // --- Sub-menu de Transferências ---
    else if (opcaoEscolhida === 'transferencias') {
        document.getElementById('mb-texto-visor').innerText = "Selecione o tipo de transferência:";
        menu.innerHTML = `
            <button class="mb-btn-ecra" onclick="validarSubMenuTransferencia('transferencia')">Transferência Bancária</button>
            <button class="mb-btn-ecra" onclick="validarSubMenuTransferencia('mbway')">MB WAY</button>
        `;
    }
};

window.validarBotaoLevantamento = function(valor) {
    if (valor * 100 === missaoAtiva.valorCents) finalizarOperacao();
    else erroTeclado(`A tarefa pede ${missaoAtiva.valorCents / 100} EUR.`);
};

window.validarSubMenuPagamento = function(botao) {
    if (botao !== missaoAtiva.tipoPagamento) {
        return erroTeclado(`Esta fatura é de ${missaoAtiva.tipoPagamento}.`);
    }
    
    iniciarInput('inserir_entidade', "Introduza a Entidade (5 dígitos)\ne prima CONFIRMAR");
};

window.validarSubMenuTransferencia = function(opcao) {
    if (opcao !== missaoAtiva.modoDificil) {
        const mensagem = (missaoAtiva.modoDificil === 'mbway') ? 
            "A tarefa pede um envio por MB WAY." : 
            "A tarefa pede uma Transferência Bancária.";
        return erroTeclado(mensagem);
    }

    if (opcao === 'mbway') {
        iniciarInput('inserir_telemovel', "Introduza o Nº Telemóvel\ne prima CONFIRMAR");
    } else {
        iniciarInput('inserir_iban', "Introduza o IBAN (21 dígitos)\ne prima CONFIRMAR");
    }
};

window.iniciarInput = function(novaFase, titulo) {
    faseAtual = novaFase;
    estadoVisor = '';
    document.getElementById('mb-menu-opcoes').style.display = 'none';
    document.getElementById('mb-input-visor').style.display = 'block';
    atualizarVisorInteligente(titulo);
};

// ==========================================
// 7. O FINAL FELIZ E A RECOLHA FÍSICA
// ==========================================
let itensParaRecolher = 0;
let itensRecolhidos = 0;
let resultadoFinal = { tempo: 0, erros: 0 };

window.finalizarOperacao = function() {
    faseAtual = 'sucesso';
    document.getElementById('mb-menu-opcoes').style.display = 'none';
    document.getElementById('mb-input-visor').style.display = 'none';
    
    tempoFimOperacao = new Date();
    resultadoFinal.tempo = Math.round((tempoFimOperacao - tempoInicioOperacao) / 1000);
    resultadoFinal.erros = errosOperacao;
    
    itensParaRecolher = 0;
    itensRecolhidos = 0;

    const textoVisor = document.getElementById('mb-texto-visor');
    textoVisor.innerText = "A processar o seu pedido...\nPor favor aguarde.";
    textoVisor.style.color = "#f5f6fa";

    setTimeout(() => {
        textoVisor.innerText = "Operação efetuada com sucesso.\n\nA retirar itens...";
        textoVisor.style.color = "#4cd137";

        if (nivelAtual === 'facil') { 
            dispensarDinheiro(missaoAtiva.valorCents / 100); 
            itensParaRecolher++; 
        }
        imprimirTalao(); 
        itensParaRecolher++;

        setTimeout(() => {
            const cartao = document.getElementById('cartao-cliente');
            if(cartao) cartao.classList.remove('cartao-entrou');
            itensParaRecolher++;
            
            setTimeout(() => {
                ativarRecolhaDeItens();
            }, 2600); 
            
        }, 1000); 
    }, 2000);
};

// ==========================================
// 8. MOTORES DE DISTRIBUIÇÃO E RECOLHA
// ==========================================
function ativarRecolhaDeItens() {
    const textoVisor = document.getElementById('mb-texto-visor');
    textoVisor.innerText = "Por favor, clique nos itens\npara os recolher.";
    textoVisor.style.color = "#e84118";
    
    const cartao = document.getElementById('cartao-cliente');
    if(cartao) { cartao.classList.add('item-clicavel'); cartao.onclick = () => recolherItem('cartao'); }

    const talao = document.getElementById('papel-talao');
    if(talao) { talao.classList.add('item-clicavel'); talao.onclick = () => recolherItem('talao'); }

    const notas = document.querySelector('.mb-maco-notas');
    if(notas) { notas.classList.add('item-clicavel'); notas.onclick = () => recolherItem('dinheiro'); }
}

window.recolherItem = function(tipo) {
    if (tipo === 'cartao') document.getElementById('saida-cartao').innerHTML = '';
    if (tipo === 'talao') document.getElementById('saida-talao').innerHTML = '';
    if (tipo === 'dinheiro') document.getElementById('saida-dinheiro').innerHTML = '';

    itensRecolhidos++;

    if(itensRecolhidos === itensParaRecolher) {
        mostrarResultadosBanco();
    }
}

function dispensarDinheiro(valorLevantado) {
    const saidaDinheiro = document.getElementById('saida-dinheiro');
    if (!saidaDinheiro) return;

    let htmlDasNotas = '<div class="mb-maco-notas">';
    let restante = valorLevantado;
    let zIndex = 50; 

    const notasNoCofre = [
        { valor: 100, imagem: 'img/dinheiro/100euro_front.jpg' },
        { valor: 50,  imagem: 'img/dinheiro/50euro_front.jpg' },
        { valor: 20,  imagem: 'img/dinheiro/20euro_front.png' },
        { valor: 10,  imagem: 'img/dinheiro/10euro_front.png' },
        { valor: 5, imagem: 'img/dinheiro/5euro_front.png'}
    ];

    notasNoCofre.forEach(nota => {
        while (restante >= nota.valor) {
            htmlDasNotas += `
                <div class="mb-nota" style="z-index: ${zIndex};">
                    <img src="${nota.imagem}" alt="${nota.valor} Euros">
                </div>`;
            restante -= nota.valor;
            zIndex--; 
        }
    });
    
    htmlDasNotas += '</div>';
    saidaDinheiro.innerHTML = htmlDasNotas;

    setTimeout(() => {
        const notasParaSair = document.querySelectorAll('.mb-nota');
        notasParaSair.forEach(notaDiv => {
            notaDiv.classList.add('nota-saiu');
        });
    }, 100);
}

function imprimirTalao() {
    const saidaTalao = document.getElementById('saida-talao');
    if (!saidaTalao) return;

    let opTxt = "CAIXA AUTOMÁTICO", detTxt = "", valTxt = "";

    if (nivelAtual === 'facil') { opTxt = "LEVANTAMENTO"; valTxt = (missaoAtiva.valorCents / 100).toFixed(2) + " EUR"; } 
    else if (nivelAtual === 'medio') { opTxt = "PAGAMENTO SERVIÇOS"; detTxt = `Ent: ${missaoAtiva.entidade}<br>Ref: ${missaoAtiva.referencia.replace(/(.{3})/g, '$1 ')}`; valTxt = (missaoAtiva.valorMedioCents / 100).toFixed(2) + " EUR"; } 
    else if (nivelAtual === 'dificil') {
        if (missaoAtiva.modoDificil === 'transferencia') { opTxt = "TRANSFERÊNCIA"; detTxt = `IBAN:<br>PT50 ${missaoAtiva.iban.substring(0,4)}...`; valTxt = "50,00 EUR"; } 
        else { opTxt = "MB WAY"; detTxt = `Nº Tel:<br>${missaoAtiva.telemovel.replace(/(.{3})/g, '$1 ')}`; valTxt = "20,00 EUR"; }
    }

    const dataAtual = new Date();
    const horaStr = dataAtual.getHours().toString().padStart(2, '0') + ":" + dataAtual.getMinutes().toString().padStart(2, '0');

    saidaTalao.innerHTML = `
        <div class="mb-maco-talao">
            <div id="papel-talao" class="mb-talao">
                <div class="mb-talao-cabecalho">CAIXA AUTOMÁTICO</div>
                <div class="mb-talao-linha"><span>HORA:</span><span>${horaStr}</span></div>
                <div class="mb-talao-linha"><span>OPE:</span><span>${opTxt}</span></div>
                <div style="margin: 5px 0;">${detTxt}</div>
                <div class="mb-talao-linha" style="font-weight:bold; margin-top:5px; border-top:1px dashed #b2bec3; padding-top:5px;"><span>VALOR:</span><span>${valTxt.replace('.', ',')}</span></div>
            </div>
        </div>`;

    setTimeout(() => { document.getElementById('papel-talao').classList.add('talao-saiu'); }, 100);
}

// ==========================================
// 9. ECRÃ DE RESULTADOS FINAIS
// ==========================================
window.mostrarResultadosBanco = function() {
    
    guardarMetricasBanco(resultadoFinal.tempo, resultadoFinal.erros);
    
    document.querySelector('.layout-banco').style.display = 'none';
    const zonaResultados = document.getElementById('zona-resultados-banco');
    zonaResultados.style.display = 'block'; 

    zonaResultados.innerHTML = `
        <div style="max-width: 650px; margin: 20px auto; text-align: center;">
            <h2 style="color: #00b894; font-size: 3.2rem; margin-bottom: 30px;">🏦 Operação Concluída!</h2>
            
            <div style="background: #f1f2f6; padding: 35px; border-radius: 15px; text-align: left; font-size: 1.8rem; margin-bottom: 40px; line-height: 2; color: #2d3436; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <p style="margin-bottom: 15px; border-bottom: 2px dashed #ccc; padding-bottom: 15px;">
                    <span style="font-size: 2.2rem;">⏱️</span> <strong>Tempo Gasto:</strong><br> 
                    Demorou <strong>${resultadoFinal.tempo} segundos</strong> a finalizar a operação.
                </p>
                <p style="padding-top: 5px;">
                    <span style="font-size: 2.2rem;">⚠️</span> <strong>Precisão:</strong><br> 
                    Cometeu <strong>${resultadoFinal.erros} erro(s)</strong> .
                </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; margin: 0 auto;">
                
                <button style="background-color: #00b894; color: white; border: none; padding: 18px; font-size: 1.8rem; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 0 #009477; width: 100%; transition: transform 0.1s;" onclick="jogarNovamenteBanco()" onmousedown="this.style.transform='translateY(5px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='none'; this.style.boxShadow='0 5px 0 #009477';">
                    Próxima Tarefa no Banco ➔
                </button>

                <button style="background-color: transparent; color: white; border: 2px solid #ffffff; padding: 18px; font-size: 1.6rem; border-radius: 12px; cursor: pointer; font-weight: bold; width: 100%; transition: background-color 0.2s;" onclick="voltarDoResultadoBanco()" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                    ⬅ Mudar de Nível
                </button>
                
            </div>
        </div>
    `;
};

// ==========================================
// 10. FUNÇÕES DOS BOTÕES DE RESULTADO
// ==========================================
window.jogarNovamenteBanco = function() {
    document.getElementById('zona-resultados-banco').style.display = 'none';
    document.querySelector('.layout-banco').style.display = 'flex';
    window.iniciarMultibanco(); 
};

window.voltarDoResultadoBanco = function() {
    document.getElementById('zona-resultados-banco').style.display = 'none';
    document.querySelector('.layout-banco').style.display = 'flex';
    window.voltarAoMenuDificuldade(); 
};

// ==========================================
// 11. GUARDAR DADOS NA BASE DE DADOS JSON
// ==========================================
function guardarMetricasBanco(tempoGasto, totalErros) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_banco) { 
            bd[sessao].historico_banco = []; 
        }

        const dataAtual = new Date().toLocaleString('pt-PT');
        
        let tipoOperacao = 'Desconhecida';
        if (nivelAtual === 'facil') tipoOperacao = 'Levantamento';
        else if (nivelAtual === 'medio') tipoOperacao = `Pagamento (${missaoAtiva.tipoPagamento})`;
        else if (nivelAtual === 'dificil') tipoOperacao = (missaoAtiva.modoDificil === 'mbway') ? 'MB WAY' : 'Transferência Bancária';
        
        bd[sessao].historico_banco.push({
            data: dataAtual,
            nivel: nivelAtual, 
            operacao: tipoOperacao, 
            tempo_segundos: tempoGasto,
            erros: totalErros
        });

        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        
        fetch('/api/guardar', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(bd) 
        }).catch(err => console.log("Erro no servidor a guardar Multibanco:", err));
        
        console.log("Estatísticas do Banco guardadas com sucesso para a sessão:", sessao);
    } else {
        console.warn("Atenção: Nenhuma sessão de paciente ativa. O jogo não foi guardado na BD.");
    }
}