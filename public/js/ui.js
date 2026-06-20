function gerarDinheiro() {
    const itens = ['🪙', '💶', '💰', '💸'];
    const container = document.getElementById('chuva-dinheiro');
    if (!container) return; 
    
    const elemento = document.createElement('div');
    elemento.classList.add('dinheiro');
    elemento.innerText = itens[Math.floor(Math.random() * itens.length)];
    
    elemento.style.left = Math.random() * 100 + 'vw';
    elemento.style.fontSize = (Math.random() * 25 + 25) + 'px';
    
    const duracao = Math.random() * 6 + 7;
    elemento.style.animationDuration = duracao + 's';
    
    container.appendChild(elemento);

    setTimeout(() => {
        elemento.remove();
    }, duracao * 1000);
}

if (document.getElementById('chuva-dinheiro')) setInterval(gerarDinheiro, 500);

const botaoJogar = document.getElementById('botao-jogar');
if (botaoJogar) {
    botaoJogar.addEventListener('click', function() {
        window.location.href = "registo.html";
    });
}

const btnAbrirPerfil = document.getElementById('abrir-perfil');
const btnFecharPerfil = document.getElementById('fechar-perfil');
const barraPerfil = document.getElementById('barra-perfil');

if (btnAbrirPerfil && btnFecharPerfil && barraPerfil) {
    btnAbrirPerfil.addEventListener('click', function() {
        barraPerfil.classList.add('aberta');
        btnAbrirPerfil.classList.add('escondido'); 
    });
    btnFecharPerfil.addEventListener('click', function() {
        barraPerfil.classList.remove('aberta');
        btnAbrirPerfil.classList.remove('escondido'); 
    });
}
