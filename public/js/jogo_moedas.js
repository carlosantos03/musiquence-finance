// ==========================================
// 1. BASE DE DADOS 
// ==========================================
const dinheiroPT = [
    { id: '1c', nome: '1 Cêntimo', tipo: 'moeda', imgFrente: 'img/dinheiro/1cent_front.png', imgTras: 'img/dinheiro/1cent_back.png', corBorda: 0xb87333, raio: 1.0 },
    { id: '2c', nome: '2 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/2cent_front.png', imgTras: 'img/dinheiro/2cent_back.png', corBorda: 0xb87333, raio: 1.2 },
    { id: '5c', nome: '5 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/5cent_front.png', imgTras: 'img/dinheiro/5cent_back.png', corBorda: 0xb87333, raio: 1.4 },
    { id: '10c', nome: '10 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/10cent_front.png', imgTras: 'img/dinheiro/10cent_back.png', corBorda: 0xffd700, raio: 1.3 },
    { id: '20c', nome: '20 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/20cent_front.png', imgTras: 'img/dinheiro/20cent_back.png', corBorda: 0xffd700, raio: 1.5 },
    { id: '50c', nome: '50 Cêntimos', tipo: 'moeda', imgFrente: 'img/dinheiro/50cent_front.png', imgTras: 'img/dinheiro/50cent_back.png', corBorda: 0xffd700, raio: 1.7 },
    { id: '1e', nome: '1 Euro', tipo: 'moeda', imgFrente: 'img/dinheiro/1euro_front.png', imgTras: 'img/dinheiro/1euro_back.png', corBorda: 0xffd700, raio: 1.6 }, // Borda Dourada
    { id: '2e', nome: '2 Euros', tipo: 'moeda', imgFrente: 'img/dinheiro/2euro_front.png', imgTras: 'img/dinheiro/2euro_back.png', corBorda: 0xc0c0c0, raio: 1.8 }, // Borda Prateada
    { id: '5n', nome: '5 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/5euro_front.png', imgTras: 'img/dinheiro/5euro_back.png', largura: 4.8, altura: 2.5 },
    { id: '10n', nome: '10 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/10euro_front.png', imgTras: 'img/dinheiro/10euro_back.png', largura: 5.0, altura: 2.6 },
    { id: '20n', nome: '20 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/20euro_front.png', imgTras: 'img/dinheiro/20euro_back.png', largura: 5.2, altura: 2.8 },
    { id: '50n', nome: '50 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/50euro_front.jpg', imgTras: 'img/dinheiro/50euro_back.jpg', largura: 5.4, altura: 2.9 },
    { id: '100n', nome: '100 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/100euro_front.jpg', imgTras: 'img/dinheiro/100euro_back.png', largura: 5.6, altura: 3.0 },
    { id: '200n', nome: '200 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/200euro_front.jpg', imgTras: 'img/dinheiro/200euro_back.jpg', largura: 5.8, altura: 3.1 },
    { id: '500n', nome: '500 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/500euro_front.jpg', imgTras: 'img/dinheiro/500euro_back.jpg', largura: 6.0, altura: 3.2 }
];

// ==========================================
// 2. CONFIGURAÇÃO DO ECRÃ 3D
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 7.5; 

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(luzAmbiente);
const luzDireta = new THREE.DirectionalLight(0xffffff, 0.6);
luzDireta.position.set(2, 5, 5);
scene.add(luzDireta);

const textureLoader = new THREE.TextureLoader();

let objetoAtual3D = null;
let itemCorreto = null;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.enableZoom = false; 
controls.enablePan = false; 
controls.autoRotate = true; 
controls.autoRotateSpeed = 1.5; 
let tempoInicioDesafio = 0;

// ==========================================
// 3. LÓGICA DO JOGO E GERAÇÃO 3D REALISTA
// ==========================================
function gerarNovoDesafio() {
    document.getElementById('mensagem-moeda').innerText = '';
    document.getElementById('btn-proximo').style.display = 'none';

    if (objetoAtual3D) scene.remove(objetoAtual3D);

    const indexAleatorio = Math.floor(Math.random() * dinheiroPT.length);
    itemCorreto = dinheiroPT[indexAleatorio];

    const texturaFrente = textureLoader.load(itemCorreto.imgFrente);
    const texturaTras = textureLoader.load(itemCorreto.imgTras);

    let geometria, material;

    if (itemCorreto.tipo === 'nota') {
        geometria = new THREE.BoxGeometry(itemCorreto.largura, itemCorreto.altura, 0.02);
        const matBorda = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, roughness: 0.9, transparent: true });
        const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, roughness: 0.9, transparent: true });
        material = [matBorda, matBorda, matBorda, matBorda, matFrente, matTras];
    } else {
        geometria = new THREE.CylinderGeometry(itemCorreto.raio, itemCorreto.raio, 0.15, 64);
        const matBorda = new THREE.MeshStandardMaterial({ color: itemCorreto.corBorda, metalness: 0.7, roughness: 0.3 });
        const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, metalness: 0.4, roughness: 0.5, transparent: true });
        const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, metalness: 0.4, roughness: 0.5, transparent: true });
        material = [matBorda, matFrente, matTras];
    }

    objetoAtual3D = new THREE.Mesh(geometria, material);
    
    if (itemCorreto.tipo === 'moeda') {
        objetoAtual3D.rotation.x = Math.PI / 2;
    }
    
    scene.add(objetoAtual3D);
    gerarBotoes(itemCorreto);

    tempoInicioDesafio = Date.now();
}

function gerarBotoes(itemCerto) {
    const zonaBotoes = document.getElementById('zona-botoes');
    zonaBotoes.innerHTML = '';

    let opcoes = [itemCerto];
    while (opcoes.length < 3) {
        let errado = dinheiroPT[Math.floor(Math.random() * dinheiroPT.length)];
        if (!opcoes.includes(errado)) {
            opcoes.push(errado);
        }
    }

    opcoes.sort(() => Math.random() - 0.5);

    opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.className = 'btn-nivel';
        btn.style.margin = '0';
        btn.style.flex = '1';
        btn.style.maxWidth = '200px';
        btn.innerText = opcao.nome;
        btn.onclick = () => verificarResposta(opcao, btn);
        zonaBotoes.appendChild(btn);
    });
}

function verificarResposta(opcaoEscolhida, botaoClicado) {
    const tempoGasto = Math.max(1, Math.round((Date.now() - tempoInicioDesafio) / 1000));
    
    const feed = document.getElementById('mensagem-moeda');
    const todosBotoes = document.querySelectorAll('#zona-botoes button');
    let acertou = false;

    todosBotoes.forEach(b => b.disabled = true);

    if (opcaoEscolhida.id === itemCorreto.id) {
        acertou = true;
        feed.innerText = `🌟 Certo! É ${itemCorreto.nome}. (Demorou ${tempoGasto}s)`;
        feed.style.color = "#00b894";
        botaoClicado.style.background = "#00b894";
        botaoClicado.style.color = "white";
        objetoAtual3D.userData.vitoria = true; 
    } else {
        feed.innerText = `❌ Errou! Era ${itemCorreto.nome}. (Demorou ${tempoGasto}s)`;
        feed.style.color = "#ff7675";
        botaoClicado.style.background = "#ff7675";
        botaoClicado.style.color = "white";
    }

    document.getElementById('btn-proximo').style.display = 'block';

    // GUARDA NA BASE DE DADOS
    guardarMetricaMoedas(acertou, tempoGasto, itemCorreto.nome);
}

// ==========================================
// FUNÇÃO PARA GUARDAR NA MEMÓRIA DO BROWSER
// ==========================================
function guardarMetricaMoedas(acertou, tempo, nomeMoeda) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_moedas) { bd[sessao].historico_moedas = []; }

        const dataAtual = new Date().toLocaleString('pt-PT');
        
        bd[sessao].historico_moedas.push({
            data: dataAtual,
            nivel: 'facil',
            moeda: nomeMoeda,
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
// 4. MOTOR DE ANIMAÇÃO 60 FPS
// ==========================================
function animar() {
    requestAnimationFrame(animar);

    if (objetoAtual3D) {
        if (objetoAtual3D.userData.vitoria) {
            objetoAtual3D.rotation.z += 0.15;
            objetoAtual3D.rotation.x += 0.10;
        }
    }
    controls.update(); 
    
    renderer.render(scene, camera);
}

gerarNovoDesafio();
animar();