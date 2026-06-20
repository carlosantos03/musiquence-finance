// ==========================================
// 1. DADOS E VARIÁVEIS GERAIS
// ==========================================
let nivelAtual = 'facil';
let tempoInicio;
let errosOperacao = 0;
let carrinho = [];
let metodoSelecionado = '';
let catalogoAtual = []; 
let categoriaSelecionada = 'todas';

// Adicionado o valorMinimo aqui
let missaoAtiva = { 
    produtosObrigatorios: [], orcamento: 0, portes: 0, minProdutos: 0, valorMinimo: 0,
    metodoPagamento: '', moradaGerada: '', cpGerado: '',
    mbwayGerado: '', ccNumGerado: '', ccValGerada: '', ccCvvGerado: '',
    mbEntidadeGerada: '', mbRefGerada: ''
};

const catalogo = [
    { id: 'alface', nome: 'Alface', imagem: 'img/produtos/alface.png', preco: 0.90, categoria: 'supermercado' },
    { id: 'arroz', nome: 'Arroz', imagem: 'img/produtos/arroz.png', preco: 1.30, categoria: 'supermercado' },
    { id: 'azeite', nome: 'Azeite', imagem: 'img/produtos/azeite.png', preco: 4.50, categoria: 'supermercado' },
    { id: 'bananas', nome: 'Bananas', imagem: 'img/produtos/bananas.png', preco: 1.80, categoria: 'supermercado' },
    { id: 'batata_frita', nome: 'Batatas Fritas', imagem: 'img/produtos/batata_frita.png', preco: 1.50, categoria: 'supermercado' },
    { id: 'bolacha', nome: 'Bolachas', imagem: 'img/produtos/bolacha.png', preco: 1.05, categoria: 'supermercado' },
    { id: 'carne', nome: 'Carne', imagem: 'img/produtos/carne.png', preco: 5.20, categoria: 'supermercado' },
    { id: 'chocolate', nome: 'Chocolate', imagem: 'img/produtos/chocolate.png', preco: 1.40, categoria: 'supermercado' },
    { id: 'fiambre', nome: 'Fiambre', imagem: 'img/produtos/fiambre.png', preco: 2.10, categoria: 'supermercado' },
    { id: 'frango', nome: 'Frango', imagem: 'img/produtos/frango.png', preco: 3.80, categoria: 'supermercado' },
    { id: 'leite', nome: 'Leite', imagem: 'img/produtos/leite.png', preco: 0.95, categoria: 'supermercado' },
    { id: 'macas', nome: 'Maçãs', imagem: 'img/produtos/macas.png', preco: 2.20, categoria: 'supermercado' },
    { id: 'massa', nome: 'Massa', imagem: 'img/produtos/massa.png', preco: 1.10, categoria: 'supermercado' },
    { id: 'melao', nome: 'Melão', imagem: 'img/produtos/melao.png', preco: 2.50, categoria: 'supermercado' },
    { id: 'oleo', nome: 'Óleo', imagem: 'img/produtos/oleo.png', preco: 2.90, categoria: 'supermercado' },
    { id: 'ovos', nome: 'Ovos', imagem: 'img/produtos/ovos.png', preco: 1.60, categoria: 'supermercado' },
    { id: 'peixe', nome: 'Peixe', imagem: 'img/produtos/peixe.png', preco: 4.20, categoria: 'supermercado' },
    { id: 'queijo', nome: 'Queijo', imagem: 'img/produtos/queijo.png', preco: 2.40, categoria: 'supermercado' },
    { id: 'sumo', nome: 'Sumo', imagem: 'img/produtos/sumo.png', preco: 1.40, categoria: 'supermercado' },
    { id: 'vinho', nome: 'Vinho', imagem: 'img/produtos/vinho.png', preco: 3.50, categoria: 'supermercado' },
    { id: 'benuron_comp', nome: 'Ben-u-ron Comprimidos', imagem: 'img/farmacia/benuron_comprimidos.png', preco: 3.25, categoria: 'farmacia' },
    { id: 'bisolvon_xarope', nome: 'Bisolvon Xarope', imagem: 'img/farmacia/bisolvon_xarope.png', preco: 7.49, categoria: 'farmacia' },
    { id: 'centrum_men', nome: 'Centrum Homem', imagem: 'img/farmacia/centrum_men.png', preco: 14.15, categoria: 'farmacia' },
    { id: 'dafalgan_500', nome: 'Dafalgan 500mg', imagem: 'img/farmacia/dafalgan_500mg.png', preco: 3.45, categoria: 'farmacia' },
    { id: 'voltaren_100', nome: 'Voltaren', imagem: 'img/farmacia/voltaren_100g.png', preco: 8.65, categoria: 'farmacia' },
    { id: 'brufen_20', nome: 'Brufen', imagem: 'img/farmacia/brufen_20.png', preco: 4.12, categoria: 'farmacia' },
    { id: 'benuron_xarope', nome: 'Ben-u-ron Xarope', imagem: 'img/farmacia/benuron_xarope.png', preco: 4.78, categoria: 'farmacia' },
    { id: 'bisolvon_pastilhas', nome: 'Bisolvon Comprimidos', imagem: 'img/farmacia/bisolvon_pastilhas.png', preco: 6.25, categoria: 'farmacia' },
    { id: 'centrum_women', nome: 'Centrum Mulher', imagem: 'img/farmacia/centrum_women.png', preco: 14.15, categoria: 'farmacia' },
    { id: 'dafalgan_1g', nome: 'Dafalgan 1g', imagem: 'img/farmacia/dafalgan_1g.png', preco: 5.18, categoria: 'farmacia' },
    { id: 'radio', nome: "Rádio Portátil", preco: 35.00, icone: "📻", categoria: "tecnologia" },
    { id: 'livro', nome: "Livro Palavras Cruzadas", preco: 5.50, icone: "📘", categoria: "lazer" }
];

function aleatorio(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function formatarNumero(num, zeros) { return String(num).padStart(zeros, '0'); }

// ==========================================
// 2. NAVEGAÇÃO E INICIALIZAÇÃO
// ==========================================
window.voltarAoMenuDificuldade = function() {
    carrinho = [];
    atualizarCarrinho();

    document.getElementById('ecra-niveis').style.display = 'block';
    document.getElementById('ecra-loja-online').style.display = 'none';
    
    const zonaResultados = document.getElementById('zona-resultados-online');
    if(zonaResultados) zonaResultados.style.display = 'none';
};

window.iniciarJogoOnline = function(nivel) { 
    nivelAtual = nivel;
    errosOperacao = 0;
    carrinho = [];
    metodoSelecionado = '';

    catalogoAtual = [...catalogo].sort(() => 0.5 - Math.random());

    const etiqueta = document.getElementById('etiqueta-nivel-online');
    if (etiqueta) {
        if (nivel === 'facil') { etiqueta.innerText = 'Nível 1: Fácil'; etiqueta.style.background = '#00b894'; etiqueta.style.color = '#ffffff'; } 
        else if (nivel === 'medio') { etiqueta.innerText = 'Nível 2: Médio'; etiqueta.style.background = '#fdcb6e'; etiqueta.style.color = '#2d3436'; } 
        else if (nivel === 'dificil') { etiqueta.innerText = 'Nível 3: Difícil'; etiqueta.style.background = '#d63031'; etiqueta.style.color = '#ffffff'; }
    }

    const formNome = document.getElementById('form-nome'); if(formNome) formNome.value = '';
    const formMorada = document.getElementById('form-morada'); if(formMorada) formMorada.value = '';
    const formCp = document.getElementById('form-cp'); if(formCp) formCp.value = '';
    
    const caixaErro = document.getElementById('mensagem-erro-checkout'); if(caixaErro) caixaErro.style.display = 'none';
    
    const siteDados = document.getElementById('site-dados-pagamento'); if(siteDados) siteDados.style.display = 'none';
    const botoesNormais = document.getElementById('botoes-checkout-normais'); if(botoesNormais) botoesNormais.style.display = 'flex';
    
    const inputPesquisa = document.getElementById('input-pesquisa'); if(inputPesquisa) inputPesquisa.value = ''; 
    const filtroOrdem = document.getElementById('filtro-ordem'); if(filtroOrdem) filtroOrdem.value = 'relevancia';
    
    categoriaSelecionada = 'todas';
    document.querySelectorAll('.btn-categoria').forEach(btn => btn.classList.remove('ativo'));
    const btnTudo = document.querySelector('.btn-categoria'); if(btnTudo) btnTudo.classList.add('ativo'); 
    
    const camposDinamicos = document.getElementById('campos-dinamicos-pagamento');
    if(camposDinamicos) camposDinamicos.remove();
    document.querySelectorAll('.cartao-pagamento').forEach(el => el.classList.remove('ativo'));

    const ecraNiveis = document.getElementById('ecra-niveis'); if(ecraNiveis) ecraNiveis.style.display = 'none';
    const ecraLoja = document.getElementById('ecra-loja-online'); if(ecraLoja) ecraLoja.style.display = 'block'; 
    const zonaResult = document.getElementById('zona-resultados-online'); if(zonaResult) zonaResult.style.display = 'none';
 
    const introPasso1 = document.getElementById('intro-passo-1'); if(introPasso1) introPasso1.style.display = 'block';
    const introPasso2 = document.getElementById('intro-passo-2'); if(introPasso2) introPasso2.style.display = 'none';
    const modalIntro = document.getElementById('modal-intro-jogo'); if(modalIntro) modalIntro.style.display = 'flex';
    
    gerarMissao();
    renderizarCatalogo(catalogoAtual);
    voltarAoCatalogo(); 
    atualizarCarrinho();
};

function gerarMissao() {
    const metodos = ['mbway', 'multibanco', 'cartao'];
    missaoAtiva.metodoPagamento = metodos[Math.floor(Math.random() * metodos.length)];

    const locaisMadeira = [
        { rua: "Rua Dr. Fernão de Ornelas", cp: "9000-078" }, { rua: "Avenida Arriaga", cp: "9000-060" }, { rua: "Rua da Carreira", cp: "9000-062" },
        { rua: "Caminho do Monte", cp: "9050-010" }, { rua: "Rua de Santa Maria", cp: "9060-291" }, { rua: "Avenida do Infante", cp: "9000-015" },
        { rua: "Rua da Alfândega", cp: "9000-059" }, { rua: "Rua do Aljube", cp: "9000-067" }, { rua: "Rua das Pretas", cp: "9000-047" },
        { rua: "Rua João de Deus", cp: "9050-025" }, { rua: "Largo do Município", cp: "9000-069" }, { rua: "Avenida Luís de Camões", cp: "9000-147" }
    ];

    let localDestino = locaisMadeira[Math.floor(Math.random() * locaisMadeira.length)];
    missaoAtiva.moradaGerada = localDestino.rua + ", nº " + aleatorio(1, 100);
    missaoAtiva.cpGerado = localDestino.cp;

    missaoAtiva.mbwayGerado = "9" + aleatorio(10000000, 99999999);
    missaoAtiva.ccNumGerado = formatarNumero(aleatorio(1000,9999), 4) + " " + formatarNumero(aleatorio(1000,9999), 4) + " " + formatarNumero(aleatorio(1000,9999), 4) + " " + formatarNumero(aleatorio(1000,9999), 4);
    missaoAtiva.ccValGerada = formatarNumero(aleatorio(1, 12), 2) + "/" + aleatorio(25, 30);
    missaoAtiva.ccCvvGerado = formatarNumero(aleatorio(100, 999), 3);
    missaoAtiva.mbEntidadeGerada = String(aleatorio(10000, 99999));
    missaoAtiva.mbRefGerada = formatarNumero(aleatorio(100, 999), 3) + " " + formatarNumero(aleatorio(100, 999), 3) + " " + formatarNumero(aleatorio(100, 999), 3);

    let htmlMissao = "";
    missaoAtiva.produtosObrigatorios = []; 
    missaoAtiva.portes = 0; 
    missaoAtiva.valorMinimo = 0;

    if (nivelAtual === 'facil') {
        missaoAtiva.produtosObrigatorios = [catalogo[Math.floor(Math.random() * catalogo.length)]];
        htmlMissao += `<strong>A Sua Lista:</strong><br>`;
        htmlMissao += `Compre 1x <strong>${missaoAtiva.produtosObrigatorios[0].nome}</strong>.<br><br>`;
    } 
    else if (nivelAtual === 'medio') {
        let embaralhado = [...catalogo].sort(() => 0.5 - Math.random());
        missaoAtiva.produtosObrigatorios = [embaralhado[0], embaralhado[1], embaralhado[2]];
        htmlMissao += `<strong>A Sua Lista:</strong><br>`;
        missaoAtiva.produtosObrigatorios.forEach(p => htmlMissao += `- 1x ${p.nome}<br>`); 
        htmlMissao += `<br>`;
    } 
    else if (nivelAtual === 'dificil') {
        const combinacoesPossiveis = [
            { orc: 25.00, min: 10.00, port: 2.99 },
            { orc: 35.00, min: 18.00, port: 3.99 },
            { orc: 45.00, min: 25.00, port: 4.99 },
            { orc: 60.00, min: 35.00, port: 5.99 }
        ];
        
        let sorteio = combinacoesPossiveis[Math.floor(Math.random() * combinacoesPossiveis.length)];
        
        missaoAtiva.orcamento = sorteio.orc; 
        missaoAtiva.valorMinimo = sorteio.min;
        missaoAtiva.portes = sorteio.port;

        htmlMissao += `<strong>A Sua Lista:</strong><br>`;
        htmlMissao += `Escolha os produtos que quiser!<br><br>`;
        htmlMissao += `<span style="color:#d63031; font-weight:bold;">Total Mínimo: ${missaoAtiva.valorMinimo.toFixed(2).replace('.',',')}€</span><br>`;
        htmlMissao += `<span style="color:#00b894; font-weight:bold;">Orçamento: ${missaoAtiva.orcamento.toFixed(2).replace('.',',')}€</span><br>`;
        htmlMissao += `Portes de Envio: ${missaoAtiva.portes.toFixed(2).replace('.',',')}€<br><br>`;
    }

    const nomeRealJogador = localStorage.getItem('nomeJogador') || 'Convidado';
    let partesNome = nomeRealJogador.trim().split(/\s+/);
    let nomeCurtoApresentado = partesNome.length > 1 ? partesNome[0] + " " + partesNome[partesNome.length - 1] : nomeRealJogador;

    htmlMissao += `<strong>Dados para Envio:</strong><br>Morada: <span style="color:#0984e3; font-weight:bold;">${missaoAtiva.moradaGerada}</span><br>Cód. Postal: <span style="color:#0984e3; font-weight:bold;">${missaoAtiva.cpGerado}</span><br><br><strong>Dados de Pagamento:</strong><br>`;
    
    if (missaoAtiva.metodoPagamento === 'multibanco') {
        htmlMissao += `Pagar com: <strong style="color:#0984e3;">Multibanco</strong>`;
    } else if (missaoAtiva.metodoPagamento === 'mbway') {
        htmlMissao += `Nº MB WAY: <strong style="color:#0984e3;">${missaoAtiva.mbwayGerado}</strong>`;
    } else {
        htmlMissao += `Cartão: <strong style="color:#0984e3;">${missaoAtiva.ccNumGerado}</strong><br>Val: <strong style="color:#0984e3;">${missaoAtiva.ccValGerada}</strong> | CVV: <strong style="color:#0984e3;">${missaoAtiva.ccCvvGerado}</strong>`;
    }

    document.getElementById('texto-missao-online').innerHTML = htmlMissao;
}

window.mostrarIntroPasso2 = function() {
    document.getElementById('intro-passo-1').style.display = 'none';
    document.getElementById('intro-passo-2').style.display = 'block';
};

// Controla o botão "Jogar" da introdução e COMEÇA A CONTAR O TEMPO
window.comecarJogoAposIntro = function() {
    document.getElementById('modal-intro-jogo').style.display = 'none';
    
    tempoInicio = new Date();
};

// ==========================================
// 3. LOJA E CARRINHO
// ==========================================
function renderizarCatalogo(listaDeProdutos) {
    const divCatalogo = document.getElementById('fase-catalogo');
    divCatalogo.innerHTML = '';

    if (listaDeProdutos.length === 0) {
        divCatalogo.innerHTML = `<p style="font-size: 1.8rem; color: #d63031; text-align: center; grid-column: 1 / -1; padding: 40px;">Não há produtos nesta categoria com esse nome. 😕</p>`; return;
    }

    listaDeProdutos.forEach(prod => {
        let visualProduto = prod.imagem ? `<img src="${prod.imagem}" alt="${prod.nome}" style="height: 100px; width: 100%; object-fit: contain; filter: drop-shadow(3px 5px 8px rgba(0,0,0,0.2));">` : `<div style="font-size: 6rem; line-height: 100px;">${prod.icone}</div>`;
        divCatalogo.innerHTML += `<div class="produto-card"><div class="produto-img-placeholder" style="height: 110px; margin-bottom: 15px;">${visualProduto}</div><h4>${prod.nome}</h4><div class="preco">${prod.preco.toFixed(2).replace('.', ',')}€</div><button class="btn-add-carrinho" onclick="adicionarAoCarrinho('${prod.id}')">🛒 Adicionar</button></div>`;
    });
}

window.filtrarCategoria = function(categoria, botaoClicado) {
    categoriaSelecionada = categoria;
    document.querySelectorAll('.btn-categoria').forEach(btn => btn.classList.remove('ativo'));
    botaoClicado.classList.add('ativo'); pesquisarEOrdenar();
};

window.pesquisarEOrdenar = function() {
    const termoPesquisa = document.getElementById('input-pesquisa').value.toLowerCase().trim();
    const ordemEscolhida = document.getElementById('filtro-ordem').value;
    
    let produtosFiltrados = catalogoAtual.filter(prod => {
        const correspondeAoNome = prod.nome.toLowerCase().includes(termoPesquisa);
        const correspondeACategoria = (categoriaSelecionada === 'todas') || (prod.categoria === categoriaSelecionada);
        return correspondeAoNome && correspondeACategoria;
    });
    
    if (ordemEscolhida === 'preco-asc') produtosFiltrados.sort((a, b) => a.preco - b.preco);
    else if (ordemEscolhida === 'preco-desc') produtosFiltrados.sort((a, b) => b.preco - a.preco);
    else if (ordemEscolhida === 'az') produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (ordemEscolhida === 'za') produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));

    renderizarCatalogo(produtosFiltrados);
};

window.adicionarAoCarrinho = function(id) {
    const produto = catalogo.find(p => p.id === id);
    carrinho.push(produto);
    atualizarCarrinho();
    const btnCarrinho = document.querySelector('.site-carrinho');
    btnCarrinho.style.transform = 'scale(1.1)'; setTimeout(() => btnCarrinho.style.transform = 'scale(1)', 200);
};

window.removerDoCarrinho = function(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho(); renderizarCheckout();
};

function atualizarCarrinho() { document.getElementById('contador-carrinho').innerText = carrinho.length; }

window.abrirCarrinho = function() {
    document.getElementById('fase-pesquisa').style.display = 'none'; 
    document.getElementById('fase-categorias').style.display = 'none'; 
    document.getElementById('fase-catalogo').style.display = 'none';
    document.getElementById('fase-checkout').style.display = 'block';
    renderizarCheckout();
};

window.voltarAoCatalogo = function() {
    document.getElementById('fase-pesquisa').style.display = 'flex'; 
    document.getElementById('fase-categorias').style.display = 'flex'; 
    document.getElementById('fase-catalogo').style.display = 'grid'; 
    document.getElementById('fase-checkout').style.display = 'none';
    
    // Esconde telemóveis e repõe botões do checkout
    document.getElementById('modal-telemovel').style.display = 'none';
    document.getElementById('modal-homebanking').style.display = 'none';
    document.getElementById('site-dados-pagamento').style.display = 'none';
    document.getElementById('botoes-checkout-normais').style.display = 'flex';
};

function renderizarCheckout() {
    const lista = document.getElementById('lista-carrinho-checkout');
    lista.innerHTML = ''; let subtotal = 0;

    if(carrinho.length === 0) {
        lista.innerHTML = '<p style="font-size:1.4rem;">O carrinho está vazio.</p>';
    } else {
        carrinho.forEach((prod, index) => {
            subtotal += prod.preco;
            let miniatura = prod.imagem ? `<img src="${prod.imagem}" style="height: 30px; width: 30px; object-fit: contain; vertical-align: middle; margin-right: 10px;">` : `<span style="font-size: 1.5rem; margin-right: 10px; vertical-align: middle;">${prod.icone}</span>`;
            lista.innerHTML += `<div class="linha-carrinho"><span>${miniatura} ${prod.nome}</span><span>${prod.preco.toFixed(2).replace('.', ',')}€ <button class="btn-remover" onclick="removerDoCarrinho(${index})">X</button></span></div>`;
        });
    }

    let total = subtotal + missaoAtiva.portes;
    document.getElementById('checkout-subtotal').innerText = subtotal.toFixed(2).replace('.', ',') + '€';
    document.getElementById('checkout-portes').innerText = missaoAtiva.portes.toFixed(2).replace('.', ',') + '€';
    document.getElementById('checkout-total').innerText = total.toFixed(2).replace('.', ',') + '€';
    
    // Cor condicional para o nível difícil baseada no valor mínimo e no orçamento máximo
    if (nivelAtual === 'dificil') {
        if (total < missaoAtiva.valorMinimo || total > missaoAtiva.orcamento) {
            document.getElementById('checkout-total').style.color = '#d63031'; // Vermelho se estiver fora da meta
        } else {
            document.getElementById('checkout-total').style.color = '#00b894'; // Verde se estiver perfeito!
        }
    } else {
        document.getElementById('checkout-total').style.color = '#00b894'; 
    }
}

window.formatarCartao = function(input) {
    let cursor = input.selectionStart; let tamanhoAntes = input.value.length;
    let valorNumerico = input.value.replace(/\D/g, ''); 
    let formatado = valorNumerico.replace(/(\d{4})/g, '$1 ').trim();
    input.value = formatado;
    if (cursor !== tamanhoAntes) input.setSelectionRange(cursor, cursor);
};

window.formatarData = function(input) {
    let cursor = input.selectionStart; let tamanhoAntes = input.value.length;
    let valorNumerico = input.value.replace(/\D/g, ''); let formatado = valorNumerico;
    if (valorNumerico.length >= 3) formatado = valorNumerico.substring(0, 2) + '/' + valorNumerico.substring(2, 4);
    input.value = formatado;
    if (cursor !== tamanhoAntes) input.setSelectionRange(cursor, cursor);
};

window.selecionarPagamento = function(metodo) {
    metodoSelecionado = metodo;
    document.querySelectorAll('.cartao-pagamento').forEach(el => el.classList.remove('ativo'));
    document.querySelector(`input[value="${metodo}"]`).parentElement.classList.add('ativo');

    const camposAntigos = document.getElementById('campos-dinamicos-pagamento');
    if(camposAntigos) camposAntigos.remove();

    const divCampos = document.createElement('div');
    divCampos.id = 'campos-dinamicos-pagamento'; divCampos.className = 'pagamento-detalhes';

    if (metodo === 'mbway') {
        divCampos.innerHTML = `<p><strong>MB WAY:</strong> Introduza o telemóvel fornecido na missão.</p><input type="text" id="input-mbway" placeholder="Ex: 912345678" maxlength="9" autocomplete="off" oninput="this.value = this.value.replace(/\\D/g, '')">`;
    } else if (metodo === 'cartao') {
        divCampos.innerHTML = `<p><strong>Cartão de Crédito/Débito:</strong> Introduza os dados fornecidos na missão.</p><input type="text" id="input-cc-num" placeholder="Número do Cartão" maxlength="19" autocomplete="off" oninput="formatarCartao(this)"><div style="display: flex; gap: 10px;"><input type="text" id="input-cc-val" placeholder="MM/AA" maxlength="5" autocomplete="off" oninput="formatarData(this)"><input type="text" id="input-cc-cvv" placeholder="CVV" maxlength="3" autocomplete="off" oninput="this.value = this.value.replace(/\\D/g, '')"></div>`;
    } else if (metodo === 'multibanco') {
        divCampos.innerHTML = `<p><strong>Referência Multibanco:</strong> Os dados de pagamento serão gerados e mostrados no ecrã seguinte após clicar em Confirmar e Pagar.</p>`;
    }
    document.querySelector('.opcoes-pagamento').insertAdjacentElement('afterend', divCampos);
};

// ==========================================
// 5. VALIDAÇÃO INTELIGENTE 
// ==========================================
window.mostrarErro = function(mensagem) {
    const caixaErro = document.getElementById('mensagem-erro-checkout');
    caixaErro.innerHTML = `⚠️ ${mensagem}`; caixaErro.style.display = 'block';
    caixaErro.scrollIntoView({ behavior: 'smooth', block: 'center' }); errosOperacao++;
};

window.validarCompra = function() {
    document.getElementById('mensagem-erro-checkout').style.display = 'none';

    // 1. Produtos
    if (nivelAtual === 'dificil') {
        let subtotal = carrinho.reduce((sum, p) => sum + p.preco, 0);
        let custoTotal = subtotal + missaoAtiva.portes;

        if (carrinho.length === 0) {
            return mostrarErro("O carrinho está vazio!");
        }
        
        if (custoTotal < missaoAtiva.valorMinimo) {
            return mostrarErro(`Valor Mínimo não atingido! O Total a Pagar (${custoTotal.toFixed(2)}€) tem de ser igual ou superior a ${missaoAtiva.valorMinimo.toFixed(2)}€.`);
        }
        if (custoTotal > missaoAtiva.orcamento) {
            return mostrarErro(`Orçamento Excedido! O Total a Pagar (${custoTotal.toFixed(2)}€) ultrapassa os ${missaoAtiva.orcamento.toFixed(2)}€.`);
        }
    } 
    else {
        if (carrinho.length !== missaoAtiva.produtosObrigatorios.length) return mostrarErro("O carrinho não tem a quantidade certa de produtos.");
        let temTudo = missaoAtiva.produtosObrigatorios.every(pMissao => carrinho.some(pCar => pCar.id === pMissao.id));
        if (!temTudo) return mostrarErro("Os produtos no carrinho não correspondem exatamente à sua missão.");
    }

    // 2. Dados Pessoais
    const nome = document.getElementById('form-nome').value.trim();
    const morada = document.getElementById('form-morada').value.trim();
    const cp = document.getElementById('form-cp').value.trim();
    
    if (!nome || !morada || !cp) return mostrarErro("Falta preencher Nome, Morada ou Código Postal.");

    const nomeReal = localStorage.getItem('nomeJogador') || 'Convidado';
    let partesReal = nomeReal.trim().split(/\s+/);
    let nomeEsperadoCurto = partesReal.length > 1 ? (partesReal[0] + " " + partesReal[partesReal.length - 1]).toLowerCase() : nomeReal.toLowerCase();
    let nomeInseridoLimpo = nome.toLowerCase().replace(/\s+/g, ' '); 

    if (nomeReal !== 'Convidado' && nomeInseridoLimpo !== nomeEsperadoCurto && nomeInseridoLimpo !== nomeReal.toLowerCase()) {
        let pEsp = partesReal.length > 1 ? partesReal[0] + " " + partesReal[partesReal.length - 1] : nomeReal;
        return mostrarErro(`O Nome não coincide com o dono da conta. Escreva o seu primeiro e último nome: <strong>${pEsp}</strong>`);
    }

    if (morada.toLowerCase().replace(/\s+/g, '') !== missaoAtiva.moradaGerada.toLowerCase().replace(/\s+/g, '')) return mostrarErro(`A Morada está incorreta. Copie exatamente: <strong>${missaoAtiva.moradaGerada}</strong>`);
    if (cp !== missaoAtiva.cpGerado) return mostrarErro(`O Código Postal está incorreto. Copie exatamente: <strong>${missaoAtiva.cpGerado}</strong>`);
    if (metodoSelecionado !== missaoAtiva.metodoPagamento) return mostrarErro(`A missão exige que pague utilizando outro método.`);

    if (metodoSelecionado === 'mbway') {
        if (document.getElementById('input-mbway').value.trim() !== missaoAtiva.mbwayGerado) return mostrarErro("O número MB WAY está incorreto.");
    } else if (metodoSelecionado === 'cartao') {
        const num = document.getElementById('input-cc-num').value.trim();
        const val = document.getElementById('input-cc-val').value.trim();
        const cvv = document.getElementById('input-cc-cvv').value.trim();
        if (num !== missaoAtiva.ccNumGerado || val !== missaoAtiva.ccValGerada || cvv !== missaoAtiva.ccCvvGerado) return mostrarErro("Os dados do cartão não coincidem com a missão.");
    }

    // 3. Encaminhamento Final
    if (metodoSelecionado === 'mbway') abrirTelemovelMBWay();
    else if (metodoSelecionado === 'multibanco') abrirTelemovelMultibanco();
    else finalizarCompraSucesso();
};

// ==========================================
// 6. AS APPS DOS TELEMÓVEIS 
// ==========================================

// --- MB WAY ---
let mbwayIntervalo; let tempoRestanteMBWay = 240; 
window.abrirTelemovelMBWay = function() {
    let totalPago = carrinho.reduce((s, p) => s + p.preco, 0) + missaoAtiva.portes;
    document.getElementById('mbway-valor-ecra').innerText = totalPago.toFixed(2).replace('.',',') + '€';
    document.getElementById('modal-telemovel').style.display = 'flex';
    tempoRestanteMBWay = 240; atualizarRelogioMBWay();
    mbwayIntervalo = setInterval(atualizarRelogioMBWay, 1000);
};

function atualizarRelogioMBWay() {
    tempoRestanteMBWay--;
    document.getElementById('mbway-tempo').innerText = `${Math.floor(tempoRestanteMBWay / 60).toString().padStart(2, '0')}:${(tempoRestanteMBWay % 60).toString().padStart(2, '0')}`;
    if (tempoRestanteMBWay <= 0) {
        clearInterval(mbwayIntervalo); document.getElementById('modal-telemovel').style.display = 'none'; mostrarErro("O tempo MB WAY expirou.");
    }
}

window.aceitarMBWay = function() { clearInterval(mbwayIntervalo); document.getElementById('modal-telemovel').style.display = 'none'; finalizarCompraSucesso(); };
window.recusarMBWay = function() { clearInterval(mbwayIntervalo); document.getElementById('modal-telemovel').style.display = 'none'; mostrarErro("O pagamento foi recusado no telemóvel."); };

// --- MULTIBANCO / HOMEBANKING ---
window.formatarReferenciaMB = function(input) {
    let cursor = input.selectionStart; let tamanhoAntes = input.value.length;
    let valorNumerico = input.value.replace(/\D/g, ''); 
    let formatado = valorNumerico.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    input.value = formatado;
    if (cursor !== tamanhoAntes) input.setSelectionRange(cursor, cursor);
};

window.abrirTelemovelMultibanco = function() {
    let total = (carrinho.reduce((s,p)=>s+p.preco,0) + missaoAtiva.portes).toFixed(2);
    
    // 1. Mostra os dados na NOVA página isolada
    const entAlvo = document.getElementById('gateway-ent'); if(entAlvo) entAlvo.innerText = missaoAtiva.mbEntidadeGerada;
    const refAlvo = document.getElementById('gateway-ref'); if(refAlvo) refAlvo.innerText = missaoAtiva.mbRefGerada;
    const valAlvo = document.getElementById('gateway-val'); if(valAlvo) valAlvo.innerText = total.replace('.',',') + "€";
    
    // 2. Esconde o site da loja por completo e mostra a página isolada
    document.getElementById('ecra-loja-online').style.display = 'none';
    const ecraPend = document.getElementById('ecra-pagamento-pendente'); if(ecraPend) ecraPend.style.display = 'block';
    
    // 3. Abre a App Banco no telemóvel lateral
    const modalHB = document.getElementById('modal-homebanking'); if(modalHB) modalHB.style.display = 'block';
    const inputEnt = document.getElementById('hb-entidade'); if(inputEnt) inputEnt.value = '';
    const inputRef = document.getElementById('hb-referencia'); if(inputRef) inputRef.value = '';
    const inputVal = document.getElementById('hb-valor'); if(inputVal) inputVal.value = '';
};

window.pagarHomebanking = function() {
    let entDigitada = document.getElementById('hb-entidade').value.trim();
    let refDigitada = document.getElementById('hb-referencia').value.trim();
    let valDigitado = document.getElementById('hb-valor').value.trim().replace(',', '.');

    let totalPago = carrinho.reduce((sum, p) => sum + p.preco, 0) + missaoAtiva.portes;
    let totalCertoFormatado = totalPago.toFixed(2);

    if (entDigitada !== missaoAtiva.mbEntidadeGerada) return mostrarErro("App Banco: A Entidade está incorreta.");
    if (refDigitada !== missaoAtiva.mbRefGerada) return mostrarErro("App Banco: A Referência está incorreta. Verifique os espaços.");
    if (Number(valDigitado).toFixed(2) !== totalCertoFormatado || isNaN(Number(valDigitado))) return mostrarErro("App Banco: O Valor está incorreto.");

    // Sucesso! Esconde o telemóvel e a página pendente
    document.getElementById('modal-homebanking').style.display = 'none';
    const ecraPend = document.getElementById('ecra-pagamento-pendente'); if(ecraPend) ecraPend.style.display = 'none';
    finalizarCompraSucesso();
};

window.cancelarHomebanking = function() {
    // Esconde o telemóvel e a página pendente
    document.getElementById('modal-homebanking').style.display = 'none';
    const ecraPend = document.getElementById('ecra-pagamento-pendente'); if(ecraPend) ecraPend.style.display = 'none';
    
    // Devolve o jogador ao site da loja
    document.getElementById('ecra-loja-online').style.display = 'block'; 
    mostrarErro("O pagamento Multibanco foi cancelado no telemóvel.");
};

// ==========================================
// 7. RESULTADOS E GRAVAÇÃO
// ==========================================
window.finalizarCompraSucesso = function() {
    let tempoGasto = Math.round((new Date() - tempoInicio) / 1000);
    if (typeof guardarMetricasOnline === "function") guardarMetricasOnline(tempoGasto, errosOperacao);

    document.getElementById('ecra-loja-online').style.display = 'none';
    const btnLateral = document.querySelector('.coluna-missao .btn-voltar-lateral'); if(btnLateral) btnLateral.style.display = 'none';
    document.getElementById('zona-resultados-online').style.display = 'block';

    let msg = "";
    if (metodoSelecionado === 'multibanco') msg = `<p style="font-size: 1.6rem; color: #00b894; font-weight: bold;">🏦 Fatura paga na App do Banco!</p>`;
    else if (metodoSelecionado === 'mbway') msg = `<p style="font-size: 1.6rem; color: #00b894; font-weight: bold;">📱 Pagamento MB WAY Autorizado!</p>`;
    else msg = `<p style="font-size: 1.6rem; color: #00b894; font-weight: bold;">💳 Pagamento com Cartão efetuado com sucesso!</p>`;

    document.getElementById('zona-resultados-online').innerHTML = `
        <div class="caixa-privacidade" style="max-width: 800px; margin: 0 auto; padding: 40px; text-align: center;">
            <h2 style="color: #00b894; font-size: 3.2rem; margin-top: 0;">🛒 Encomenda Registada!</h2>
            <p style="font-size: 1.8rem; color: #ffffff;">Os produtos serão enviados para: <strong>${document.getElementById('form-morada').value}</strong>.</p>
            ${msg}
            <div style="background: #f1f2f6; padding: 20px; border-radius: 15px; text-align: left; font-size: 1.8rem; margin-bottom: 40px; line-height: 2; color: #2d3436; border: 1px solid #dfe6e9;">
                <p style="margin: 5px 0;">⏱️ Tempo de Compra: <strong>${tempoGasto} segundos</strong></p>
                <p style="margin: 5px 0;">⚠️ Erros no processo: <strong>${errosOperacao} erro(s)</strong></p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 500px; margin: 0 auto;">
                <button style="background-color: #00b894; color: white; border: none; padding: 18px; font-size: 1.8rem; border-radius: 12px; cursor: pointer; font-weight: bold; box-shadow: 0 5px 0 #009477; width: 100%; transition: transform 0.1s;" onclick="jogarNovamenteOnline()" onmousedown="this.style.transform='translateY(5px)'; this.style.boxShadow='none';" onmouseup="this.style.transform='none'; this.style.boxShadow='0 5px 0 #009477';">Fazer Outra Compra ➔</button>
                <button style="background-color: transparent; color: white; border: 2px solid #ffffff; padding: 18px; font-size: 1.6rem; border-radius: 12px; cursor: pointer; font-weight: bold; width: 100%; transition: background-color 0.2s;" onclick="voltarDoResultadoOnline()" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">⬅ Mudar de Nível</button>
            </div>
        </div>
    `;
};

window.jogarNovamenteOnline = function() {
    document.getElementById('zona-resultados-online').style.display = 'none';
    const btnLateral = document.querySelector('.coluna-missao .btn-voltar-lateral'); if(btnLateral) btnLateral.style.display = 'block';
    iniciarJogoOnline(nivelAtual); 
};

window.voltarDoResultadoOnline = function() {
    document.getElementById('zona-resultados-online').style.display = 'none';
    const btnLateral = document.querySelector('.coluna-missao .btn-voltar-lateral'); if(btnLateral) btnLateral.style.display = 'block';
    voltarAoMenuDificuldade(); 
};

window.guardarMetricasOnline = function(tempoGasto, errosCometidos) {
    const sessao = localStorage.getItem('sessaoAtual'); let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_comprasonline) { bd[sessao].historico_comprasonline = []; }
        bd[sessao].historico_comprasonline.push({ data: new Date().toLocaleString('pt-PT'), nivel: nivelAtual, tempo_compras_segundos: tempoGasto, erros_checkout: errosCometidos });
        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        fetch('/api/guardar', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(bd) }).catch(e => console.log(e));
    }
};