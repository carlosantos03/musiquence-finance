const btnSairBarra = document.querySelector('.btn-sair'); 
const modalSair = document.getElementById('modal-sair');
const btnCancelarSaida = document.getElementById('btn-cancelar-saida');
const btnConfirmarSaida = document.getElementById('btn-confirmar-saida');

if (btnSairBarra && modalSair) {
    btnSairBarra.addEventListener('click', function(evento) {
        evento.preventDefault();
        modalSair.classList.add('mostrar');
    });
    btnCancelarSaida.addEventListener('click', function() {
        modalSair.classList.remove('mostrar');
    });
    btnConfirmarSaida.addEventListener('click', function() {
        window.location.href = "index.html";
    });
}