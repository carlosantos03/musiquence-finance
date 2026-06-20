const formRegisto = document.getElementById('formulario-jogador');
if (formRegisto) {
    formRegisto.addEventListener('submit', function(evento) {
        evento.preventDefault(); 

        const inputNome = document.getElementById('nome-jogador-input');
        const inputData = document.getElementById('data-nascimento');
        const msgErro = document.getElementById('mensagem-erro');
        
        const nomeIntroduzido = inputNome.value.trim();
        const dataIntroduzida = inputData.value;
        
        let mensagemTexto = ""; 
        let temErro = false;    

        if (nomeIntroduzido === "" && dataIntroduzida === "") {
            mensagemTexto = "⚠️ Por favor, preencha o seu nome e a data de nascimento.";
            temErro = true;
            inputNome.focus();
        } else if (nomeIntroduzido === "") {
            mensagemTexto = "⚠️ Por favor, não se esqueça de escrever o seu nome.";
            temErro = true;
            inputNome.focus();
        } else if (dataIntroduzida === "") {
            mensagemTexto = "⚠️ Por favor, indique a sua data de nascimento.";
            temErro = true;
            inputData.focus();
        } else {
            const partesNome = nomeIntroduzido.split(/\s+/);
            if (partesNome.length < 2) {
                mensagemTexto = "⚠️ Por favor, escreva o seu nome completo.";
                temErro = true;
                inputNome.focus();
            }
        }

        if (temErro) {
            if (msgErro) {
                msgErro.innerText = mensagemTexto; 
                msgErro.classList.add('mostrar');
                setTimeout(() => msgErro.classList.remove('mostrar'), 3500);
            }
            return; 
        }

        let bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
        const chaveUnica = nomeIntroduzido + "_" + dataIntroduzida; 

        
        if (!bd_pacientes[chaveUnica]) {
            bd_pacientes[chaveUnica] = { 
                nome: nomeIntroduzido, 
                dataNascimento: dataIntroduzida, 
                foto: "", 
                pontuacoes: {} 
            };
        } 
        // Se já existir, não fazemos nada, faz apenas login nessa conta!

        localStorage.setItem('bd_pacientes', JSON.stringify(bd_pacientes));
        localStorage.setItem('sessaoAtual', chaveUnica);
        localStorage.setItem('nomeJogador', nomeIntroduzido);

        fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bd_pacientes)
        }).then(() => {
            window.location.href = "menu_jogos.html";
        }).catch(erro => console.error("Erro ao guardar:", erro));
    });
}