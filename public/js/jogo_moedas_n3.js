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
    { id: '20n', nome: '20 Euros', tipo: 'nota', imgFrente: 'img/dinheiro/20euro_front.png', imgTras: 'img/dinheiro/20euro_back.png', largura: 5.2, altura: 2.8, valorCents: 2000 }
];

// ==========================================
// 2. CONFIGURAÇÃO DO ECRÃ E CÂMARA
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 18, 0.1); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true; 
container.appendChild(renderer.domElement);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.85); 
scene.add(luzAmbiente);

const luzDireta = new THREE.DirectionalLight(0xffdfb0, 0.4);
luzDireta.position.set(2, 10, 2);
luzDireta.castShadow = true;
scene.add(luzDireta);

const chaoGeo = new THREE.PlaneGeometry(50, 50);
const chaoMat = new THREE.ShadowMaterial({ opacity: 0.3, depthWrite: false });
const chao = new THREE.Mesh(chaoGeo, chaoMat);
chao.rotation.x = -Math.PI / 2;
chao.position.y = -0.05;
chao.receiveShadow = true;
scene.add(chao);

// ==========================================
// A CAIXA FORTE DO COFRE
// ==========================================
const cofreMat = new THREE.MeshStandardMaterial({ 
    color: 0x2c3e50, 
    metalness: 0.3, 
    roughness: 0.2,
    transparent: true, 
    opacity: 0.4 
});

const tetoGeo = new THREE.BoxGeometry(9, 0.2, 15);
const teto = new THREE.Mesh(tetoGeo, cofreMat);
teto.position.set(7.5, 1.2, 0); 
teto.castShadow = true;
scene.add(teto);

const paredeDirGeo = new THREE.BoxGeometry(0.4, 1.2, 15);
const paredeDir = new THREE.Mesh(paredeDirGeo, cofreMat);
paredeDir.position.set(11.8, 0.6, 0);
scene.add(paredeDir);

const paredeCimaGeo = new THREE.BoxGeometry(9, 1.2, 0.4);
const paredeCima = new THREE.Mesh(paredeCimaGeo, cofreMat);
paredeCima.position.set(7.5, 0.6, -7.3); 
scene.add(paredeCima);

const paredeBaixoGeo = new THREE.BoxGeometry(9, 1.2, 0.4);
const paredeBaixo = new THREE.Mesh(paredeBaixoGeo, cofreMat);
paredeBaixo.position.set(7.5, 0.6, 7.3); 
scene.add(paredeBaixo);

const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let objetosNoEcra = []; 
let valorObjetivoCents = 0;
let valorAtualCents = 0;
let tempoInicioDesafio = 0;
let jogoTerminado = false;
let errosNesteDesafio = 0; 

// ==========================================
// 3. LÓGICA DO JOGO E ESPAÇAMENTO
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

function gerarNovoDesafioN3() {
    jogoTerminado = false;
    errosNesteDesafio = 0; // Reset aos erros no início de cada jogada
    document.getElementById('mensagem-moeda').innerText = '';
    document.getElementById('btn-proximo').style.display = 'none';
    document.getElementById('btn-limpar').style.display = 'inline-block';
    
    valorAtualCents = 0;
    atualizarPaineis();

    objetosNoEcra.forEach(obj => scene.remove(obj));
    objetosNoEcra = [];
    valorObjetivoCents = 0;

    let dinheiroSolucao = [];
    let qtdSolucao = Math.floor(Math.random() * 2) + 3; 
    for(let i=0; i < qtdSolucao; i++) {
        let sorteado = dinheiroPT[Math.floor(Math.random() * dinheiroPT.length)];
        dinheiroSolucao.push(sorteado);
        valorObjetivoCents += sorteado.valorCents;
    }

    let dinheiroEngano = [];
    for(let i=0; i < 4; i++) {
        dinheiroEngano.push(dinheiroPT[Math.floor(Math.random() * dinheiroPT.length)]);
    }

    let dinheiroMesa = dinheiroSolucao.concat(dinheiroEngano);
    dinheiroMesa.sort(() => Math.random() - 0.5);

    const posicoesX_Esquerda = [-8.5, -3.0]; 
    const posicoesZ = [-5.5, -2.0, 1.5, 5.0];

    let index = 0;
    for (let x of posicoesX_Esquerda) {
        for (let z of posicoesZ) {
            if (index >= dinheiroMesa.length) break;
            
            const item = dinheiroMesa[index];
            const texturaFrente = textureLoader.load(item.imgFrente);
            const texturaTras = textureLoader.load(item.imgTras);

            let mesh;
            if (item.tipo === 'nota') {
                const geometria = new THREE.BoxGeometry(item.largura, item.altura, 0.02);
                const matBorda = new THREE.MeshStandardMaterial({ color: 0xdddddd });
                const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, roughness: 0.9, transparent: true });
                const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, roughness: 0.9, transparent: true });
                mesh = new THREE.Mesh(geometria, [matBorda, matBorda, matBorda, matBorda, matFrente, matTras]);
                mesh.rotation.x = -Math.PI / 2; 
                mesh.rotation.z = (Math.random() - 0.5) * 0.1; 
            } else {
                const geometria = new THREE.CylinderGeometry(item.raio, item.raio, 0.15, 64);
                const matBorda = new THREE.MeshStandardMaterial({ color: item.corBorda, metalness: 0.7, roughness: 0.4 });
                const matFrente = new THREE.MeshStandardMaterial({ map: texturaFrente, metalness: 0.2, roughness: 0.7, transparent: true });
                const matTras = new THREE.MeshStandardMaterial({ map: texturaTras, metalness: 0.2, roughness: 0.7, transparent: true });
                mesh = new THREE.Mesh(geometria, [matBorda, matFrente, matTras]);
                mesh.rotation.x = 0; 
                mesh.rotation.y = (Math.random() - 0.5) * 0.2; 
            }
            
            mesh.position.set(x, 0, z);
            mesh.castShadow = true;
            
            let destinoCalculado = (x === -8.5) ? 9.5 : 6.0;

            mesh.userData = {
                valor: item.valorCents,
                selecionada: false,
                posOrigemX: x,               
                posDestinoX: destinoCalculado 
            };

            scene.add(mesh);
            objetosNoEcra.push(mesh);
            index++;
        }
    }

    atualizarPaineis();
    tempoInicioDesafio = Date.now();
}

function atualizarPaineis() {
    document.getElementById('valor-objetivo').innerText = formatarDinheiro(valorObjetivoCents);
    const painelAtual = document.getElementById('valor-atual');
    painelAtual.innerText = formatarDinheiro(valorAtualCents);

    if (valorAtualCents > valorObjetivoCents) {
        painelAtual.style.color = "#ff7675"; 
    } else {
        painelAtual.style.color = "#00b894"; 
    }
}

// ==========================================
// 4. O CLIQUE (Selecionar e Mover)
// ==========================================
container.addEventListener('pointerdown', (event) => {
    if (jogoTerminado) return; 

    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersetados = raycaster.intersectObjects(objetosNoEcra);

    if (intersetados.length > 0) {
        const objetoClicado = intersetados[0].object;

        if (objetoClicado.userData.selecionada) {
            objetoClicado.userData.selecionada = false;
            valorAtualCents -= objetoClicado.userData.valor;
        } else {
            // VERIFICA O ERRO ANTES DE ADICIONAR
            if (valorAtualCents + objetoClicado.userData.valor > valorObjetivoCents) {
                errosNesteDesafio++;
            }
            objetoClicado.userData.selecionada = true;
            valorAtualCents += objetoClicado.userData.valor;
        }

        atualizarPaineis();
        verificarVitoria();
    }
});

function verificarVitoria() {
    if (valorAtualCents === valorObjetivoCents) {
        jogoTerminado = true;
        const tempoGasto = Math.max(1, Math.round((Date.now() - tempoInicioDesafio) / 1000));
        
        const feed = document.getElementById('mensagem-moeda');
        if (errosNesteDesafio === 0) {
            feed.innerText = `🌟 Perfeito! Sem errar! (${tempoGasto}s)`;
        } else {
            feed.innerText = `👍 Cofre fechado! (Erros: ${errosNesteDesafio} | ${tempoGasto}s)`;
        }
        feed.style.color = "#FFD700";

        document.getElementById('btn-proximo').style.display = 'inline-block';
        document.getElementById('btn-limpar').style.display = 'none';

        const fezTudoPerfeito = (errosNesteDesafio === 0);
        guardarMetricaMoedasN3(fezTudoPerfeito, tempoGasto, formatarDinheiro(valorObjetivoCents), errosNesteDesafio);
    }
}

window.limparSelecao = function() {
    if (jogoTerminado) return;
    valorAtualCents = 0;
    objetosNoEcra.forEach(obj => {
        obj.userData.selecionada = false;
    });
    atualizarPaineis();
}

// ==========================================
// FUNÇÃO PARA GUARDAR NA MEMÓRIA E NO SERVIDOR NODE.JS
// ==========================================
function guardarMetricaMoedasN3(acertou, tempo, total, numErros) {
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_moedas) { bd[sessao].historico_moedas = []; }

        bd[sessao].historico_moedas.push({
            data: new Date().toLocaleString('pt-PT'),
            nivel: 'dificil',
            moeda: total,
            acertou: acertou,
            erros: numErros, 
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
// 5. ANIMAÇÃO SUAVE 
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

function animar() {
    requestAnimationFrame(animar);
    
    objetosNoEcra.forEach(obj => {
        let alvoX = obj.userData.selecionada ? obj.userData.posDestinoX : obj.userData.posOrigemX;
        obj.position.x += (alvoX - obj.position.x) * 0.1;
    });

    renderer.render(scene, camera);
}

gerarNovoDesafioN3();
animar();