// ==========================================
// 1. BASE DE DADOS COMPLETA 
// ==========================================
const dinheiroPT = [
    { id: '1c', nome: '1 Cêntimo', tipo: 'moeda', imgFrente: 'img/dinheiro/1cent_front.png', imgTras: 'img/dinheiro/1cent_back.png', corBorda: 0xb87333, raio: 1.0, valorCents: 1 },
    { id: '2c', nome: '2 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/2cent_front.png', imgTras: 'img/dinheiro/2cent_back.png', corBorda: 0xb87333, raio: 1.2, valorCents: 2 },
    { id: '5c', nome: '5 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/5cent_front.png', imgTras: 'img/dinheiro/5cent_back.png', corBorda: 0xb87333, raio: 1.4, valorCents: 5 },
    { id: '10c', nome: '10 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/10cent_front.png', imgTras: 'img/dinheiro/10cent_back.png', corBorda: 0xffd700, raio: 1.3, valorCents: 10 },
    { id: '20c', nome: '20 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/20cent_front.png', imgTras: 'img/dinheiro/20cent_back.png', corBorda: 0xffd700, raio: 1.5, valorCents: 20 },
    { id: '50c', nome: '50 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/50cent_front.png', imgTras: 'img/dinheiro/50cent_back.png', corBorda: 0xffd700, raio: 1.7, valorCents: 50 },
    { id: '1e', nome: '1 Euro', tipo: 'moeda', imgFrente: 'img/dinheiro/1euro_front.png', imgTras: 'img/dinheiro/1euro_back.png', corBorda: 0xffd700, raio: 1.6, valorCents: 100 },
    { id: '2e', nome: '2 Euros', tipo: 'moeda', imgFrente: 'img/dinheiro/2euro_front.png', imgTras: 'img/dinheiro/2euro_back.png', corBorda: 0xc0c0c0, raio: 1.8, valorCents: 200 },
    { id: '5n', nome: '5 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/5euro_front.png', imgTras: 'img/dinheiro/5euro_back.png', largura: 4.8, altura: 2.5, valorCents: 500 },
    { id: '10n', nome: '10 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/10euro_front.png', imgTras: 'img/dinheiro/10euro_back.png', largura: 5.0, altura: 2.6, valorCents: 1000 },
    { id: '20n', nome: '20 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/20euro_front.png', imgTras: 'img/dinheiro/20euro_back.png', largura: 5.2, altura: 2.8, valorCents: 2000 },
    { id: '50n', nome: '50 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/50euro_front.jpg', imgTras: 'img/dinheiro/50euro_back.jpg', largura: 5.4, altura: 2.9, valorCents: 5000 },
    { id: '100n', nome: '100 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/100euro_front.jpg', imgTras: 'img/dinheiro/100euro_back.png', largura: 5.6, altura: 3.0, valorCents: 10000 },
    { id: '200n', nome: '200 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/200euro_front.jpg', imgTras: 'img/dinheiro/200euro_back.jpg', largura: 5.8, altura: 3.1, valorCents: 20000 },
    { id: '500n', nome: '500 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/500euro_front.jpg', imgTras: 'img/dinheiro/500euro_back.jpg', largura: 6.0, altura: 3.2, valorCents: 50000 }
];

// ==========================================
// 2. CONFIGURAÇÃO DO ECRÃ 3D
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 12; 
camera.position.y = 2; 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(luzAmbiente);
const luzDireta = new THREE.DirectionalLight(0xffffff, 0.6);
luzDireta.position.set(2, 5, 5);
scene.add(luzDireta);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();

let objetosNoEcra = []; 
let valorCorretoCents = 0;
let tempoInicioDesafio = 0;

// ==========================================
// 3. LÓGICA DO JOGO
// ==========================================
function formatarDinheiro(cents) {
    if (cents >= 100) {
        let euros = Math.floor(cents / 100);
        let centimosResto = cents % 100;
        return `${euros},${centimosResto < 10 ? '0' : ''}${centimosResto}€`;
    } else {
        return `0,${cents < 10 ? '0' : ''}${cents}€`;
    }
}

function gerarNovoDesafioN2() {
    document.getElementById('mensagem-moeda').innerText = '';
    document.getElementById('btn-proximo').style.display = 'none';
    
    objetosNoEcra.forEach(obj => scene.remove(obj));
    objetosNoEcra = [];
    valorCorretoCents = 0;

    const quantidadeObjetos = Math.random() > 0.5 ? 2 : 3;
    const posicoesX = quantidadeObjetos === 2 ? [-3.5, 3.5] : [-6.5, 0, 6.5];

    for (let i = 0; i < quantidadeObjetos; i++) {
        const itemSorteado = dinheiroPT[Math.floor(Math.random() * dinheiroPT.length)];
        valorCorretoCents += itemSorteado.valorCents;

        const texturaFrente = textureLoader.load(itemSorteado.imgFrente);
        const texturaTras = textureLoader.load(itemSorteado.imgTras);

        let mesh;

        if (itemSorteado.tipo === 'nota') {
            const geometria = new THREE.BoxGeometry(itemSorteado.largura, itemSorteado.altura, 0.02);
            const matBorda = new THREE.MeshStandardMaterial({ color: 0xdddddd });
            const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, roughness: 0.9, transparent: true });
            const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, roughness: 0.9, transparent: true });
            
            mesh = new THREE.Mesh(geometria, [matBorda, matBorda, matBorda, matBorda, matFrente, matTras]);
            mesh.rotation.x = -Math.PI / 8; 
            
        } 
        else {
            const geometria = new THREE.CylinderGeometry(itemSorteado.raio, itemSorteado.raio, 0.15, 64);
            const matBorda = new THREE.MeshStandardMaterial({ color: itemSorteado.corBorda, metalness: 0.7, roughness: 0.3 });
            const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, metalness: 0.4, roughness: 0.5, transparent: true });
            const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, metalness: 0.4, roughness: 0.5, transparent: true });
            
            mesh = new THREE.Mesh(geometria, [matBorda, matFrente, matTras]);
            mesh.rotation.x = Math.PI / 2; 
        }
        
        mesh.position.x = posicoesX[i];
        mesh.rotation.y = 0; 
        mesh.rotation.z = 0;

        
        scene.add(mesh);
        objetosNoEcra.push(mesh);
    }

    gerarBotoesN2();
    tempoInicioDesafio = Date.now();
}

function gerarBotoesN2() {
    const zonaBotoes = document.getElementById('zona-botoes');
    zonaBotoes.innerHTML = '';

    let opcoes = [valorCorretoCents];

    while (opcoes.length < 3) {
        let erro;
        if (valorCorretoCents > 500) { 
            erro = (Math.floor(Math.random() * 10) + 1) * 100;
        } else { // Se forem só moedas, o erro é entre 10c e 50c
            erro = (Math.floor(Math.random() * 5) + 1) * 10;
        }

        let valorErrado = Math.random() > 0.5 ? valorCorretoCents + erro : valorCorretoCents - erro;
        
        if (valorErrado > 0 && !opcoes.includes(valorErrado)) {
            opcoes.push(valorErrado);
        }
    }

    opcoes.sort(() => Math.random() - 0.5);

    opcoes.forEach(opcaoCents => {
        const btn = document.createElement('button');
        btn.className = 'btn-nivel';
        btn.style.margin = '0';
        btn.style.flex = '1';
        btn.style.maxWidth = '200px';
        btn.innerText = formatarDinheiro(opcaoCents);
        btn.onclick = () => verificarRespostaN2(opcaoCents, btn);
        zonaBotoes.appendChild(btn);
    });
}

function verificarRespostaN2(opcaoEscolhidaCents, botaoClicado) {
    const tempoGasto = Math.max(1, Math.round((Date.now() - tempoInicioDesafio) / 1000));
    const feed = document.getElementById('mensagem-moeda');
    const todosBotoes = document.querySelectorAll('#zona-botoes button');
    let acertou = false;

    todosBotoes.forEach(b => b.disabled = true);

    if (opcaoEscolhidaCents === valorCorretoCents) {
        acertou = true;
        feed.innerText = `🌟 Certo! O total é ${formatarDinheiro(valorCorretoCents)}. (Demorou ${tempoGasto}s)`;
        feed.style.color = "#00b894";
        botaoClicado.style.background = "#00b894";
        botaoClicado.style.color = "white";
        
        objetosNoEcra.forEach(obj => obj.userData.vitoria = true);
    } else {
        feed.innerText = `❌ Errou! O total era ${formatarDinheiro(valorCorretoCents)}. (Demorou ${tempoGasto}s)`;
        feed.style.color = "#ff7675";
        botaoClicado.style.background = "#ff7675";
        botaoClicado.style.color = "white";
    }

    document.getElementById('btn-proximo').style.display = 'block';

    guardarMetricaMoedasN2(acertou, tempoGasto, formatarDinheiro(valorCorretoCents)); 
}

// ==========================================
// FUNÇÃO PARA GUARDAR NA MEMÓRIA
// ==========================================
function guardarMetricaMoedasN2(acertou, tempo, total) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_moedas) { bd[sessao].historico_moedas = []; }

        const dataAtual = new Date().toLocaleString('pt-PT');
        
        bd[sessao].historico_moedas.push({
            data: dataAtual,
            nivel: 'medio',
            moeda: total, 
            acertou: acertou,
            tempo_segundos: tempo
        });

        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        
        fetch('/api/guardar', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(bd) 
        }).catch(err => console.log("Erro no servidor:", err));
    }
}

// ==========================================
// 4. ANIMAÇÃO
// ==========================================
function animar() {
    requestAnimationFrame(animar);

    objetosNoEcra.forEach(obj => {
        if (obj.userData.vitoria) {
            obj.rotation.z += 0.15; 
            obj.rotation.y += 0.10;
        } else {
            obj.rotation.z = Math.sin(Date.now() * 0.001) * 0.03; 
            obj.rotation.y = Math.sin(Date.now() * 0.0015) * 0.05;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

gerarNovoDesafioN2();
animar();