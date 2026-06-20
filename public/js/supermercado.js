// ==========================================
// 1. BASE DE DADOS: O NOSSO SUPERMERCADO 🛒
// ==========================================
const baseDadosProdutos = [
    { id: 'alface', nome: 'Alface', imagem: 'img/produtos/alface.png', precoCents: 90 },
    { id: 'arroz', nome: 'Arroz', imagem: 'img/produtos/arroz.png', precoCents: 130 },
    { id: 'azeite', nome: 'Azeite', imagem: 'img/produtos/azeite.png', precoCents: 450 },
    { id: 'bananas', nome: 'Bananas', imagem: 'img/produtos/bananas.png', precoCents: 180 },
    { id: 'batata_frita', nome: 'Batatas Fritas', imagem: 'img/produtos/batata_frita.png', precoCents: 150 },
    { id: 'bolacha', nome: 'Bolachas', imagem: 'img/produtos/bolacha.png', precoCents: 105 },
    { id: 'carne', nome: 'Carne', imagem: 'img/produtos/carne.png', precoCents: 520 },
    { id: 'chocolate', nome: 'Chocolate', imagem: 'img/produtos/chocolate.png', precoCents: 140 },
    { id: 'fiambre', nome: 'Fiambre', imagem: 'img/produtos/fiambre.png', precoCents: 210 },
    { id: 'frango', nome: 'Frango', imagem: 'img/produtos/frango.png', precoCents: 380 },
    { id: 'leite', nome: 'Leite', imagem: 'img/produtos/leite.png', precoCents: 95 },
    { id: 'macas', nome: 'Maçãs', imagem: 'img/produtos/macas.png', precoCents: 220 },
    { id: 'massa', nome: 'Massa', imagem: 'img/produtos/massa.png', precoCents: 110 },
    { id: 'melao', nome: 'Melão', imagem: 'img/produtos/melao.png', precoCents: 250 },
    { id: 'oleo', nome: 'Óleo', imagem: 'img/produtos/oleo.png', precoCents: 290 },
    { id: 'ovos', nome: 'Ovos', imagem: 'img/produtos/ovos.png', precoCents: 160 },
    { id: 'peixe', nome: 'Peixe', imagem: 'img/produtos/peixe.png', precoCents: 420 },
    { id: 'queijo', nome: 'Queijo', imagem: 'img/produtos/queijo.png', precoCents: 240 },
    { id: 'sumo', nome: 'Sumo', imagem: 'img/produtos/sumo.png', precoCents: 140 },
    { id: 'vinho', nome: 'Vinho', imagem: 'img/produtos/vinho.png', precoCents: 350 }
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
let listaCompras = []; 
let produtosNaPrateleira = []; 
let tempoInicioProduto;
let tempoFimProduto;
let tempoInicioFatura;
let errosProduto = 0;
let errosFatura = 0;

// ==========================================
// 3. NAVEGAÇÃO ENTRE ECRÃS
// ==========================================
function voltarAoMenuDificuldade() {
    document.getElementById('ecra-niveis').style.display = 'block';
    document.getElementById('ecra-supermercado').style.display = 'none';
}

function escolherNivel(nivel) {
    nivelAtual = nivel;
    
    document.getElementById('ecra-niveis').style.display = 'none';
    document.getElementById('ecra-supermercado').style.display = 'block';
    
    const etiqueta = document.getElementById('etiqueta-nivel-super');
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

    gerarSupermercado();
}

// ==========================================
// 4. MOTOR DO JOGO
// ==========================================
window.gerarSupermercado = function() {
    listaCompras = [];
    document.getElementById('lista-compras-html').innerHTML = '';
    
    const carrinho = document.getElementById('carrinho-compras');
    if (carrinho) carrinho.innerHTML = '';

    for(let i=1; i<=5; i++) {
        document.getElementById(`prateleira-${i}`).innerHTML = '';
    }

    const btnLateral = document.querySelector('.btn-voltar-lateral');
    if (btnLateral) btnLateral.style.display = 'block';

    errosProduto = 0;
    errosFatura = 0;
    tempoInicioProduto = new Date(); 

    let totalItensComprar = (nivelAtual === 'facil') ? 1 : (nivelAtual === 'medio') ? 3 : 5;
    let qtdNaPrateleira = (nivelAtual === 'facil') ? 4 : (nivelAtual === 'medio') ? 12 : 20;

    let produtosMisturados = [...baseDadosProdutos].sort(() => Math.random() - 0.5);
    produtosNaPrateleira = produtosMisturados.slice(0, qtdNaPrateleira);
    
    for (let i = 0; i < totalItensComprar; i++) {
        let produtoSorteado = produtosNaPrateleira[Math.floor(Math.random() * produtosNaPrateleira.length)];
        
        let itemExistente = listaCompras.find(p => p.id === produtoSorteado.id);
        
        if (itemExistente) {
            itemExistente.quantidadeTotal++; 
        } else {
            listaCompras.push({ 
                ...produtoSorteado, 
                quantidadeTotal: 1, 
                quantidadeComprada: 0, 
                comprado: false 
            });
        }
    }

    // Desenhar a lista final no ecrã (ex: "0/2x Arroz")
    listaCompras.forEach(alvo => {
        let textoQuantidade = alvo.quantidadeTotal > 1 ? `<span style="font-weight: bold; font-size: 1.1em;">${alvo.quantidadeTotal}x</span> ` : "";

        document.getElementById('lista-compras-html').innerHTML += `
            <li id="item-lista-${alvo.id}" style="transition: color 0.3s; margin-bottom: 8px;">
                ${textoQuantidade}${alvo.nome}
            </li>`;
    });

    // 6. Colocar produtos nas prateleiras
    produtosNaPrateleira.forEach((produto, index) => {
        const divProduto = document.createElement('div');
        divProduto.className = 'produto-caixa';
        
        divProduto.innerHTML = `
            <img src="${produto.imagem}" class="produto-img" alt="${produto.nome}">
            <div class="etiqueta-preco">${formatarDinheiro(produto.precoCents)}</div>
        `;
        
        divProduto.onclick = () => window.comprarProduto(produto, divProduto);

        // Distribuição visual nas prateleiras
        if (nivelAtual === 'facil') {
            document.getElementById('prateleira-3').appendChild(divProduto);
        } else if (nivelAtual === 'medio') {
            let numPrateleira = 2 + Math.floor(index / 4); 
            document.getElementById(`prateleira-${numPrateleira}`).appendChild(divProduto);
        } else {
            let numPrateleira = 1 + Math.floor(index / 4); 
            document.getElementById(`prateleira-${numPrateleira}`).appendChild(divProduto);
        }
    });
};
// ==========================================
// 5. CLICAR NO PRODUTO E GERAR FATURAS
// ==========================================
window.comprarProduto = function(produto, divElementoHTML) {
    let itemNaLista = listaCompras.find(item => item.id === produto.id && !item.comprado);

    if (itemNaLista) {
        itemNaLista.quantidadeComprada++;

        const carrinho = document.getElementById('carrinho-compras');
        if (carrinho) {
            carrinho.innerHTML += `<img src="${produto.imagem}" title="${produto.nome}">`;
        }

        // Ver se já comprou TODAS as unidades pedidas deste produto
        if (itemNaLista.quantidadeComprada === itemNaLista.quantidadeTotal) {
            itemNaLista.comprado = true;
            
            divElementoHTML.style.visibility = 'hidden';
            
            // Riscar na lista (Também escondendo o "1x" aqui)
            const li = document.getElementById(`item-lista-${produto.id}`);
            let textoQtdRiscar = itemNaLista.quantidadeTotal > 1 ? `<b>${itemNaLista.quantidadeTotal}x</b> ` : "";
            
            li.innerHTML = `<del>${textoQtdRiscar}${produto.nome}</del> ✅`;
            li.style.color = "#27ae60";
        } else {
            // Se ainda faltam unidades deste produto, dá só um pulo visual na prateleira
            divElementoHTML.style.transform = 'scale(1.1)';
            setTimeout(() => divElementoHTML.style.transform = 'scale(1)', 200);
        }

        // VERIFICAR SE JÁ COMPROU A LISTA INTEIRA
        let todosComprados = listaCompras.every(item => item.comprado);
        
        if (todosComprados) {
            tempoFimProduto = new Date();
            setTimeout(() => { window.gerarFaturas(); }, 1000);
        }

    } else {
        errosProduto++;

        // Borda Vermelha
        divElementoHTML.classList.add('produto-erro');
        setTimeout(() => {
            divElementoHTML.classList.remove('produto-erro');
        }, 500);
    }
};

window.gerarFaturas = function() {
    document.querySelector('.layout-supermercado').style.display = 'none';
    const btnGlobal = document.querySelector('.btn-voltar-lateral');
    if(btnGlobal) btnGlobal.style.display = 'none';

    tempoInicioFatura = new Date();

    const zonaFaturas = document.getElementById('zona-faturas');
    zonaFaturas.style.display = 'block';
    zonaFaturas.innerHTML = `
        <h3 style="color: #F0F8FF; font-size: 2.2rem; margin-bottom: 0px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Qual é o talão com o valor CORRETO? 🧾</h3>
        <div id="feedback-fatura" style="height: 35px; font-size: 1.8rem; font-weight: bold; margin-bottom: 0px; margin-top: 5px;"></div>
    `;

    const valorReal = listaCompras.reduce((soma, produto) => soma + (produto.precoCents * produto.quantidadeTotal), 0);
    
    const erros = [-50, -20, -10, 10, 20, 50];
    let erroSorteado = erros[Math.floor(Math.random() * erros.length)];
    let valorErrado = valorReal + erroSorteado;
    if (valorErrado <= 0) valorErrado = valorReal + 30;

    let opcoes = [
        { valorTotal: valorReal, correta: true },
        { valorTotal: valorErrado, correta: false }
    ].sort(() => Math.random() - 0.5);

    const container = document.createElement('div');
    container.className = 'container-faturas';

    opcoes.forEach(opcao => {
        const divTalao = document.createElement('div');
        divTalao.className = 'talao-recibo';
        
        let linhasProdutosHTML = listaCompras.map(produto => `
            <div class="talao-linha">
                <span>${produto.quantidadeTotal}x ${produto.nome}</span>
                <span>${formatarDinheiro(produto.precoCents * produto.quantidadeTotal)}</span> 
            </div>
        `).join('');

        divTalao.innerHTML = `
            <div class="talao-topo">MQ FINANCE SUPERMERCADO</div>
            ${linhasProdutosHTML}
            <div class="talao-linha" style="font-size: 1.1rem; color: #7f8c8d; margin-top: 20px;">
                <span>IVA (6%)</span>
                <span>Incluído</span>
            </div>
            <div class="talao-total">
                <span>TOTAL</span>
                <span>${formatarDinheiro(opcao.valorTotal)}</span> 
            </div>
        `;

        divTalao.onclick = () => {
            if (!container.classList.contains('resolvido')) {
                window.validarFatura(opcao.correta, divTalao, container);
            }
        };
        container.appendChild(divTalao);
    });

    zonaFaturas.appendChild(container);
};

window.validarFatura = function(isCorrect, elementoHTML, container) {
    // 1. BLOQUEAR IMEDIATAMENTE!
    container.classList.add('resolvido'); 
    
    // 2. PARAR O CRONÓMETRO E FAZER AS CONTAS
    const momentoFimFatura = new Date();
    
    // Contas limpas com as variáveis certas
    let tempoProdutoSeg = Math.round((tempoFimProduto - tempoInicioProduto) / 1000);
    let tempoFaturaSeg = Math.round((momentoFimFatura - tempoInicioFatura) / 1000);
    
    const feedback = document.getElementById('feedback-fatura');

    if (isCorrect) {
        elementoHTML.style.border = '4px solid #00b894';
        elementoHTML.style.transform = 'scale(1.05)';
        
        feedback.innerText = "🌟 Excelente! O valor está correto.";
        feedback.style.color = "#00b894";
        
        setTimeout(() => {
            window.mostrarResultados(tempoProdutoSeg, errosProduto, tempoFaturaSeg, errosFatura);
        }, 1500);
        
    } else {
        errosFatura = 1; 

        elementoHTML.style.border = '4px solid #d63031';
        elementoHTML.style.backgroundColor = '#fdf0ed';
        
        feedback.innerText = "❌ O total deste talão está errado!";
        feedback.style.color = "#d63031";
        
        setTimeout(() => {
            window.mostrarResultados(tempoProdutoSeg, errosProduto, tempoFaturaSeg, errosFatura);
        }, 2500);
    }
};
// ==========================================
// 6. ECRÃ DE RESULTADOS FINAIS
// ==========================================
window.mostrarResultados = function(tProduto, errProduto, tFatura, errFatura) {
    guardarMetricasSupermercado(tProduto, errProduto, tFatura, errFatura);
    const zonaFaturas = document.getElementById('zona-faturas');
    
    // Garantir que o botão global está escondido aqui também
    const btnGlobal = document.querySelector('#ecra-supermercado > .btn-voltar');
    if(btnGlobal) btnGlobal.style.display = 'none';

    zonaFaturas.innerHTML = `
        <div style="max-width: 650px; margin: 20px auto; text-align: center;">
            <h2 style="color: #00b894; font-size: 3.2rem; margin-bottom: 30px;">🛒 Compras Concluídas!</h2>
            
            <div style="background: #f1f2f6; padding: 35px; border-radius: 15px; text-align: left; font-size: 1.8rem; margin-bottom: 40px; line-height: 2; color: #2d3436; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <p style="margin-bottom: 15px; border-bottom: 2px dashed #ccc; padding-bottom: 15px;">
                    <span style="font-size: 2.2rem;">🔎</span> <strong>Na Prateleira:</strong><br> 
                    Demorou <strong>${tProduto} segundos</strong> e teve <strong>${errProduto} erro(s)</strong>.
                </p>
                <p style="padding-top: 5px;">
                    <span style="font-size: 2.2rem;">🧾</span> <strong>No Talão:</strong><br> 
                    Demorou <strong>${tFatura} segundos</strong> e teve <strong>${errFatura} erro(s)</strong>.
                </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; margin: 0 auto;">
                
                <button style="background-color: #00b894; color: white; border: none; padding: 18px; font-size: 1.8rem; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 0 #009477; width: 100%; transition: transform 0.1s;" onclick="jogarNovamente()" onmousedown="this.style.transform='translateY(5px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='none'; this.style.boxShadow='0 5px 0 #009477';">
                    Próxima Lista de Produtos ➔
                </button>

                <button style="background-color: transparent; color: white; border: 2px solid #ffffff; padding: 18px; font-size: 1.6rem; border-radius: 12px; cursor: pointer; font-weight: bold; width: 100%; transition: background-color 0.2s;" onclick="voltarDoResultado()" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                    ⬅ Mudar de Nível
                </button>
                
            </div>
        </div>
    `;
};

// ==========================================
// 7. FUNÇÕES DOS BOTÕES DE RESULTADO
// ==========================================
window.jogarNovamente = function() {
    document.getElementById('zona-faturas').style.display = 'none';
    document.querySelector('.layout-supermercado').style.display = 'flex';
    
    // Volta a mostrar o botão global de Mudar de Nível na prateleira
    const btnGlobal = document.querySelector('#ecra-supermercado > .btn-voltar');
    if(btnGlobal) btnGlobal.style.display = 'block';
    
    window.gerarSupermercado(); 
};

window.voltarDoResultado = function() {
    document.getElementById('zona-faturas').style.display = 'none';
    document.querySelector('.layout-supermercado').style.display = 'flex';
    
    // Volta a mostrar o botão global (para estar visível da próxima vez que entrar no jogo)
    const btnGlobal = document.querySelector('#ecra-supermercado > .btn-voltar');
    if(btnGlobal) btnGlobal.style.display = 'block';
    
    window.voltarAoMenuDificuldade(); 
};

// ==========================================
// 8. GUARDAR DADOS NA BASE DE DADOS JSON
// ==========================================
function guardarMetricasSupermercado(tempoPrateleira, errosPrat, tempoFatura, errosFat) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        // Se este paciente ainda não jogou supermercado, cria o array
        if (!bd[sessao].historico_supermercado) { 
            bd[sessao].historico_supermercado = []; 
        }

        const dataAtual = new Date().toLocaleString('pt-PT');
        
        // Empurra os dados da jogada atual
        bd[sessao].historico_supermercado.push({
            data: dataAtual,
            nivel: nivelAtual, // Vai guardar 'facil', 'medio' ou 'dificil'
            tempo_prateleira_segundos: tempoPrateleira,
            erros_prateleira: errosPrat,
            tempo_fatura_segundos: tempoFatura,
            erros_fatura: errosFat
        });

        // 1. Atualiza o LocalStorage
        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        
        // 2. Envia para a Base de Dados
        fetch('/api/guardar', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(bd) 
        }).catch(err => console.log("Erro no servidor a guardar Supermercado:", err));
        
        console.log("Estatísticas do Supermercado guardadas com sucesso!");
    } else {
        console.warn("Atenção: Nenhuma sessão de paciente ativa. Não guardou.");
    }
}