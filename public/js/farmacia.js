// ==========================================
// 1. BASE DE DADOS: A FARMÁCIA 💊
// ==========================================
const baseDadosMedicamentos = [
    { id: 'benuron_comp', nome: 'Ben-u-ron Comprimidos', imagem: 'img/farmacia/benuron_comprimidos.png', precoCents: 325 },
    { id: 'bisolvon_xarope', nome: 'Bisolvon Xarope', imagem: 'img/farmacia/bisolvon_xarope.png', precoCents: 749 },
    { id: 'centrum_men', nome: 'Centrum Homem', imagem: 'img/farmacia/centrum_men.png', precoCents: 1415 },
    { id: 'dafalgan_500', nome: 'Dafalgan 500mg', imagem: 'img/farmacia/dafalgan_500mg.png', precoCents: 345 },
    { id: 'voltaren_100', nome: 'Voltaren', imagem: 'img/farmacia/voltaren_100g.png', precoCents: 865 },
    { id: 'brufen_20', nome: 'Brufen', imagem: 'img/farmacia/brufen_20.png', precoCents: 412 },
    { id: 'benuron_xarope', nome: 'Ben-u-ron Xarope', imagem: 'img/farmacia/benuron_xarope.png', precoCents: 478 },
    { id: 'bisolvon_pastilhas', nome: 'Bisolvon Comprimidos', imagem: 'img/farmacia/bisolvon_pastilhas.png', precoCents: 625 },
    { id: 'centrum_women', nome: 'Centrum Mulher', imagem: 'img/farmacia/centrum_women.png', precoCents: 1415 },
    { id: 'dafalgan_1g', nome: 'Dafalgan 1g', imagem: 'img/farmacia/dafalgan_1g.png', precoCents: 518 },
];

function formatarDinheiro(cents) {
    let euros = Math.floor(cents / 100);
    let centimosResto = cents % 100;
    return `${euros},${centimosResto < 10 ? '0' : ''}${centimosResto}€`;
}

// ==========================================
// 2. VARIÁVEIS GERAIS
// ==========================================
let nivelAtual = 'facil';
let listaReceita = []; 
let medicamentosNaPrateleira = []; 
let tempoInicioProduto;
let tempoFimProduto;
let tempoInicioTroco;
let errosProduto = 0;
let errosTroco = 0;

// ==========================================
// 3. NAVEGAÇÃO ENTRE ECRÃS
// ==========================================
function voltarAoMenuDificuldade() {
    document.getElementById('ecra-niveis').style.display = 'block';
    document.getElementById('ecra-farmacia').style.display = 'none';
}

function escolherNivel(nivel) {
    nivelAtual = nivel;
    
    // Troca os ecrãs
    document.getElementById('ecra-niveis').style.display = 'none';
    document.getElementById('ecra-farmacia').style.display = 'block';
    
    // Muda a etiqueta de cor consoante o nível
    const etiqueta = document.getElementById('etiqueta-nivel-farmacia');
    if (nivel === 'facil') { 
        etiqueta.innerText = 'Nível 1: Fácil'; 
        etiqueta.style.background = '#00b894'; 
    } else if (nivel === 'medio') { 
        etiqueta.innerText = 'Nível 2: Médio'; 
        etiqueta.style.background = '#fdcb6e'; 
    } else if (nivel === 'dificil') { 
        etiqueta.innerText = 'Nível 3: Difícil'; 
        etiqueta.style.background = '#d63031'; 
    }

    // Prepara o ecrã para o jogo
    document.querySelector('.layout-supermercado').style.display = 'flex';
    document.getElementById('zona-troco').style.display = 'none';

    gerarFarmacia();
}

// ==========================================
// 4. MOTOR DO JOGO (PRATELEIRAS E RECEITA)
// ==========================================
window.gerarFarmacia = function() {
    listaReceita = [];
    document.getElementById('lista-receita-html').innerHTML = '';
    
    const saco = document.getElementById('saco-farmacia');
    if (saco) saco.innerHTML = '';

    for(let i=1; i<=3; i++) {
        document.getElementById(`prateleira-${i}`).innerHTML = '';
    }

    const btnLateral = document.querySelector('.btn-voltar-lateral');
    if (btnLateral) btnLateral.style.display = 'block';

    errosProduto = 0;
    errosTroco = 0;
    tempoInicioProduto = new Date(); 

    let totalItensComprar = (nivelAtual === 'facil') ? 1 : (nivelAtual === 'medio') ? 2 : 3;
    let qtdNaPrateleira = (nivelAtual === 'facil') ? 3 : (nivelAtual === 'medio') ? 6 : 9;

    let produtosMisturados = [...baseDadosMedicamentos].sort(() => Math.random() - 0.5);
    medicamentosNaPrateleira = produtosMisturados.slice(0, qtdNaPrateleira);
    
    for (let i = 0; i < totalItensComprar; i++) {
        let produtoSorteado = medicamentosNaPrateleira[Math.floor(Math.random() * medicamentosNaPrateleira.length)];
        let itemExistente = listaReceita.find(p => p.id === produtoSorteado.id);
        
        if (itemExistente) {
            itemExistente.quantidadeTotal++; 
        } else {
            listaReceita.push({ 
                ...produtoSorteado, 
                quantidadeTotal: 1, 
                quantidadeComprada: 0, 
                comprado: false 
            });
        }
    }

    listaReceita.forEach(alvo => {
        let textoQuantidade = alvo.quantidadeTotal > 1 ? `<span style="font-weight: bold; font-size: 1.1em;">${alvo.quantidadeTotal}x</span> ` : "";

        document.getElementById('lista-receita-html').innerHTML += `
            <li id="item-receita-${alvo.id}" style="transition: color 0.3s; margin-bottom: 8px;">
                ${textoQuantidade}${alvo.nome}
            </li>`;
    });

    medicamentosNaPrateleira.forEach((produto, index) => {
        const divProduto = document.createElement('div');

        divProduto.className = 'medicamento-caixa'; 
        
        divProduto.innerHTML = `
            <img src="${produto.imagem}" class="produto-img" alt="${produto.nome}">
            <div class="etiqueta-preco">${formatarDinheiro(produto.precoCents)}</div>
        `;
        
        divProduto.onclick = () => window.pegarMedicamento(produto, divProduto);

        if (nivelAtual === 'facil') {
            document.getElementById('prateleira-2').appendChild(divProduto); 
        } else if (nivelAtual === 'medio') {
            let numPrateleira = index < 3 ? 2 : 3; 
            document.getElementById(`prateleira-${numPrateleira}`).appendChild(divProduto); 
        } else {
            let numPrateleira = index < 3 ? 1 : (index < 6 ? 2 : 3); 
            document.getElementById(`prateleira-${numPrateleira}`).appendChild(divProduto); 
        }
    });
};

// ==========================================
// 5. CLICAR NO MEDICAMENTO
// ==========================================
window.pegarMedicamento = function(produto, divElementoHTML) {
    let itemNaLista = listaReceita.find(item => item.id === produto.id && !item.comprado);

    if (itemNaLista) {
        itemNaLista.quantidadeComprada++;

        const saco = document.getElementById('saco-farmacia');
        if (saco) {
            saco.innerHTML += `<img src="${produto.imagem}" title="${produto.nome}">`;
        }

        if (itemNaLista.quantidadeComprada === itemNaLista.quantidadeTotal) {
            itemNaLista.comprado = true;
            divElementoHTML.style.visibility = 'hidden';
            
            const li = document.getElementById(`item-receita-${produto.id}`);
            let textoQtdRiscar = itemNaLista.quantidadeTotal > 1 ? `<b>${itemNaLista.quantidadeTotal}x</b> ` : "";
            
            li.innerHTML = `<del>${textoQtdRiscar}${produto.nome}</del> ✅`;
            li.style.color = "#27ae60";
        } else {
            divElementoHTML.style.transform = 'scale(1.1)';
            setTimeout(() => divElementoHTML.style.transform = 'scale(1)', 200);
        }

        // VERIFICAR SE JÁ COMPROU A RECEITA INTEIRA
        let todosComprados = listaReceita.every(item => item.comprado);
        if (todosComprados) {
            tempoFimProduto = new Date();
            setTimeout(() => { window.gerarFaseTroco(); }, 1000);
        }

    } else {
        errosProduto++;
        divElementoHTML.classList.add('produto-erro');
        setTimeout(() => { divElementoHTML.classList.remove('produto-erro'); }, 500);
    }
};

// ==========================================
// 6. FASE DO PAGAMENTO E TROCO
// ==========================================
window.gerarFaseTroco = function() {
    // Esconde as prateleiras e o botão voltar
    document.querySelector('.layout-supermercado').style.display = 'none';
    const btnGlobal = document.querySelector('.btn-voltar-lateral');
    if(btnGlobal) btnGlobal.style.display = 'none';

    // Mostra a zona do troco
    const zonaTroco = document.getElementById('zona-troco');
    zonaTroco.style.display = 'block';

    tempoInicioTroco = new Date();

    // Calcula o valor total multiplicando preco pela quantidade (Lógica do teu Supermercado)
    const totalContaCents = listaReceita.reduce((soma, produto) => soma + (produto.precoCents * produto.quantidadeTotal), 0);
    
    // Decidir a nota com que o cliente vai pagar
    let valorPagoCents = 0;
    if (totalContaCents <= 500) valorPagoCents = 500;           
    else if (totalContaCents <= 1000) valorPagoCents = 1000;    
    else if (totalContaCents <= 2000) valorPagoCents = 2000;    
    else valorPagoCents = 5000;                                 

    const trocoCorretoCents = valorPagoCents - totalContaCents;

    // Gerar valores errados para o troco
    const variacoesErro = [10, -10, 50, -50, 100, -100, 200];
    let misturarErros = variacoesErro.sort(() => Math.random() - 0.5);
    
    let erro1 = trocoCorretoCents + misturarErros[0];
    let erro2 = trocoCorretoCents + misturarErros[1];
    
    if (erro1 <= 0) erro1 = trocoCorretoCents + 20;
    if (erro2 <= 0) erro2 = trocoCorretoCents + 200;

    let opcoesTroco = [
        { valor: trocoCorretoCents, correto: true },
        { valor: erro1, correto: false },
        { valor: erro2, correto: false }
    ].sort(() => Math.random() - 0.5);

    // Constrói o HTML (As 3 mãos)
    zonaTroco.innerHTML = `
        <h3 style="font-size: 2.4rem; color: #F0F8FF; margin-bottom: 10px;">🛒 Pagamento na Caixa</h3>
        
        <div id="info-pagamento" style="font-size: 1.8rem; margin-bottom: 30px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px; display: inline-block;">
            A conta da farmácia foi de <strong>${formatarDinheiro(totalContaCents)}</strong>.<br>
            Entregaste <strong>${formatarDinheiro(valorPagoCents)}</strong>.<br>
            <span style="color: #00b894; font-weight: bold; font-size: 2.2rem;">Qual é o troco certo?</span>
        </div>
        
        <div id="container-maos" class="container-maos-troco"></div>
    `;

    const containerMaos = document.getElementById('container-maos');

    opcoesTroco.forEach(opcao => {
        const divMao = document.createElement('div');
        divMao.className = 'mao-escolha';
        
        const imagensHTML = gerarImagensDinheiro(opcao.valor);

        // HTML limpo: Só mostra as imagens do dinheiro gerado, sem o texto do valor!
        divMao.innerHTML = `
            <div style="min-height: 80px; display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; align-items: center;">
                ${imagensHTML}
            </div>
        `;

        divMao.onclick = () => {
            if (!containerMaos.classList.contains('resolvido')) {
                validarTroco(opcao.correto, divMao, containerMaos);
            }
        };

        containerMaos.appendChild(divMao);
    });
};

function gerarImagensDinheiro(valorCents) {
    let html = '';
    let restante = valorCents;

    const moedasENotas = [
        { valor: 2000, img: 'img/dinheiro/20euro_front.png', tipo: 'nota' },
        { valor: 1000, img: 'img/dinheiro/10euro_front.png', tipo: 'nota' },
        { valor: 500, img: 'img/dinheiro/5euro_front.png', tipo: 'nota' },
        { valor: 200, img: 'img/dinheiro/2euro_front.png', tipo: 'moeda' },
        { valor: 100, img: 'img/dinheiro/1euro_front.png', tipo: 'moeda' },
        { valor: 50, img: 'img/dinheiro/50cent_front.png', tipo: 'moeda' },
        { valor: 20, img: 'img/dinheiro/20cent_front.png', tipo: 'moeda' },
        { valor: 10, img: 'img/dinheiro/10cent_front.png', tipo: 'moeda' },
        { valor: 5, img: 'img/dinheiro/5cent_front.png', tipo: 'moeda' },
        { valor: 2, img: 'img/dinheiro/2cent_front.png', tipo: 'moeda' },
        { valor: 1, img: 'img/dinheiro/1cent_front.png', tipo: 'moeda' }
    ];

    for (let i = 0; i < moedasENotas.length; i++) {
        let item = moedasENotas[i];
        while (restante >= item.valor) {
            let estilo = item.tipo === 'nota' 
                ? 'height: 40px; border-radius: 2px; box-shadow: 2px 2px 5px rgba(0,0,0,0.3);' 
                : 'height: 45px; border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.4);';
            html += `<img src="${item.img}" style="${estilo}">`;
            restante -= item.valor;
        }
    }

    if (html === '') html = '<span style="font-size: 1.5rem;">Certo! (Sem troco)</span>';
    return html;
}

function validarTroco(isCorrect, elementoHTML, container) {
    container.classList.add('resolvido'); 
    const momentoFimTroco = new Date();
    
    let tempoProdutoSeg = Math.round((tempoFimProduto - tempoInicioProduto) / 1000);
    let tempoTrocoSeg = Math.round((momentoFimTroco - tempoInicioTroco) / 1000);

    if (isCorrect) {
        elementoHTML.style.border = '4px solid #00b894';
        elementoHTML.style.backgroundColor = 'rgba(0, 184, 148, 0.2)';
        elementoHTML.style.transform = 'scale(1.05)';

        guardarMetricasFarmacia(tempoProdutoSeg, errosProduto, tempoTrocoSeg, errosTroco);
        
        setTimeout(() => {
            mostrarResultadosFarmacia(tempoProdutoSeg, errosProduto, tempoTrocoSeg, errosTroco);
        }, 1500);

    } else {
        errosTroco++; 
        elementoHTML.style.border = '4px solid #d63031';
        elementoHTML.style.backgroundColor = 'rgba(214, 48, 49, 0.2)';
        elementoHTML.style.animation = 'tremer 0.3s';
        setTimeout(() => elementoHTML.style.animation = '', 300);

        guardarMetricasFarmacia(tempoProdutoSeg, errosProduto, tempoTrocoSeg, errosTroco);
        
        setTimeout(() => {
            mostrarResultadosFarmacia(tempoProdutoSeg, errosProduto, tempoTrocoSeg, errosTroco);
        }, 1500);
    }
    
}

// ==========================================
// 7. ECRÃ DE RESULTADOS FINAIS
// ==========================================
function mostrarResultadosFarmacia(tProduto, errProduto, tTroco, errTroco) {
    const zonaTroco = document.getElementById('zona-troco');
    
    zonaTroco.innerHTML = `
        <div style="max-width: 650px; margin: 20px auto; text-align: center;">
            <h2 style="color: #00b894; font-size: 3.2rem; margin-bottom: 30px;">💊 Compras Concluídas!</h2>
            
            <div style="background: rgba(255,255,255,0.9); padding: 35px; border-radius: 15px; text-align: left; font-size: 1.8rem; margin-bottom: 40px; color: #2d3436; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <p style="margin-bottom: 15px; border-bottom: 2px dashed #ccc; padding-bottom: 15px;">
                    <span style="font-size: 2.2rem;">🔎</span> <strong>Na Receita:</strong><br> 
                    Demorou <strong>${tProduto} segundos</strong> com <strong>${errProduto} erro(s)</strong>.
                </p>
                <p style="padding-top: 5px;">
                    <span style="font-size: 2.2rem;">💶</span> <strong>Na Caixa (Troco):</strong><br> 
                    Demorou <strong>${tTroco} segundos</strong> com <strong>${errTroco} erro(s)</strong>.
                </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; margin: 0 auto;">
                <button style="background-color: #00b894; color: white; border: none; padding: 18px; font-size: 1.8rem; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 0 #009477; width: 100%; transition: transform 0.1s;" onclick="jogarNovamente()" onmousedown="this.style.transform='translateY(5px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='none'; this.style.boxShadow='0 5px 0 #009477';">
                    Próxima Receita ➔
                </button>
                <button style="background-color: transparent; color: white; border: 2px solid #ffffff; padding: 18px; font-size: 1.6rem; border-radius: 12px; cursor: pointer; font-weight: bold; width: 100%; transition: background-color 0.2s;" onclick="voltarDoResultado()" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                    ⬅ Mudar de Nível
                </button>
            </div>
        </div>
    `;
}

window.jogarNovamente = function() {
    document.getElementById('zona-troco').style.display = 'none';
    document.querySelector('.layout-supermercado').style.display = 'flex';
    window.gerarFarmacia(); 
};

window.voltarDoResultado = function() {
    document.getElementById('zona-troco').style.display = 'none';
    document.querySelector('.layout-supermercado').style.display = 'flex';
    window.voltarAoMenuDificuldade(); 
};
// ==========================================
// 8. GUARDAR DADOS NA BASE DE DADOS JSON
// ==========================================
function guardarMetricasFarmacia(tempoReceita, errosReceita, tempoTroco, errosTr) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        // Se este paciente ainda não jogou farmácia, cria o array
        if (!bd[sessao].historico_farmacia) { 
            bd[sessao].historico_farmacia = []; 
        }

        const dataAtual = new Date().toLocaleString('pt-PT');
        
        // Guarda os dados da jogada atual
        bd[sessao].historico_farmacia.push({
            data: dataAtual,
            nivel: nivelAtual,
            tempo_receita_segundos: tempoReceita,
            erros_receita: errosReceita,
            tempo_troco_segundos: tempoTroco,
            erros_troco: errosTr
        });

        // 1. Atualiza o LocalStorage (Backup local)
        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        
        // 2. Envia para o teu Backend (Servidor)
        fetch('/api/guardar', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(bd) 
        }).catch(err => console.log("Erro no servidor a guardar Farmácia:", err));
        
        console.log("Estatísticas da Farmácia guardadas com sucesso!");
    } else {
        console.warn("Nenhuma sessão ativa. Métricas da farmácia não guardadas.");
    }
}