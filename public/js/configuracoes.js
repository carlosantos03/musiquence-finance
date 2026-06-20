const formPrivacidade = document.getElementById('formulario-privacidade');
const inputFoto = document.getElementById('upload-foto');
const avatarPreview = document.getElementById('avatar-preview-privacidade');
const elIdade = document.getElementById('idade-jogador');
let novaFotoBase64 = ""; 

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "--";
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    
    // Se ainda não fez anos este ano, tira 1 à idade
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

if (formPrivacidade) {
    const sessaoAtual = localStorage.getItem('sessaoAtual');
    let bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
    
    // 1. CARREGAR OS DADOS QUANDO A PÁGINA ABRE
    if (sessaoAtual && bd_pacientes[sessaoAtual]) {
        const user = bd_pacientes[sessaoAtual];
        
        document.getElementById('edit-nome').value = user.nome;
        document.getElementById('edit-data').value = user.dataNascimento || "";
        
        // Mostra a idade calculada
        if (elIdade && user.dataNascimento) {
            elIdade.innerText = "Idade: " + calcularIdade(user.dataNascimento) + " anos";
        }

        if (user.foto) {
            novaFotoBase64 = user.foto;
            if (avatarPreview) {
                avatarPreview.style.backgroundImage = `url(${novaFotoBase64})`;
                avatarPreview.classList.add('com-foto');
                avatarPreview.innerText = "";
            }
        }
    }

    // 2. MUDAR A FOTOGRAFIA
    if (inputFoto) {
        inputFoto.addEventListener('change', function(evento) {
            const ficheiro = evento.target.files[0];
            if (ficheiro) {
                const leitor = new FileReader();
                leitor.onload = function(e) {
                    novaFotoBase64 = e.target.result; 
                    if (avatarPreview) {
                        avatarPreview.style.backgroundImage = `url(${novaFotoBase64})`;
                        avatarPreview.classList.add('com-foto');
                        avatarPreview.innerText = "";
                    }
                };
                leitor.readAsDataURL(ficheiro);
            }
        });
    }

    // 3. GUARDAR E VALIDAR DADOS
    formPrivacidade.addEventListener('submit', function(evento) {
        evento.preventDefault(); 
        
        const inputNome = document.getElementById('edit-nome');
        const inputData = document.getElementById('edit-data');
        
        const novoNome = inputNome.value.trim();
        const novaData = inputData.value;
        const msgErro = document.getElementById('mensagem-erro');
        const msgSucesso = document.getElementById('mensagem-sucesso');
        
        let mensagemTexto = ""; 
        let temErro = false;    

        // VERIFICAÇÃO DETALHADA
        if (novoNome === "" && novaData === "") {
            mensagemTexto = "⚠️ Por favor, preencha o seu nome e a data de nascimento.";
            temErro = true;
            inputNome.focus();
        } else if (novoNome === "") {
            mensagemTexto = "⚠️ Por favor, não se esqueça de escrever o seu nome.";
            temErro = true;
            inputNome.focus();
        } else if (novaData === "") {
            mensagemTexto = "⚠️ Por favor, indique a sua data de nascimento.";
            temErro = true;
            inputData.focus();
        } else {
            const partesNome = novoNome.split(/\s+/);
            if (partesNome.length < 2) {
                mensagemTexto = "⚠️ Por favor, escreva o seu nome completo.";
                temErro = true;
                inputNome.focus();
            }
        }

        // Se houver algum erro, mostra a mensagem e PARA o processo aqui
        if (temErro) {
            if (msgErro) {
                msgErro.innerText = mensagemTexto; 
                msgErro.classList.add('mostrar');
                setTimeout(() => msgErro.classList.remove('mostrar'), 3500);
            }
            return; 
        }

        // ==========================================
        // SE PASSOU NOS TESTES TODOS, GUARDA OS DADOS
        // ==========================================
        bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
        const novaChave = novoNome + "_" + novaData;
        
        let enviarParaServidor = null;

        if (novaChave !== sessaoAtual) {
            bd_pacientes[novaChave] = bd_pacientes[sessaoAtual] || { pontuacoes: {} }; 
            delete bd_pacientes[sessaoAtual]; 
            
            bd_pacientes[novaChave].nome = novoNome;
            bd_pacientes[novaChave].dataNascimento = novaData;
            bd_pacientes[novaChave].foto = novaFotoBase64;

            enviarParaServidor = { ...bd_pacientes };
            enviarParaServidor[sessaoAtual] = null; 
        } else {
            bd_pacientes[novaChave].nome = novoNome;
            bd_pacientes[novaChave].dataNascimento = novaData;
            bd_pacientes[novaChave].foto = novaFotoBase64;
            enviarParaServidor = bd_pacientes;
        }

        localStorage.setItem('bd_pacientes', JSON.stringify(bd_pacientes));
        localStorage.setItem('sessaoAtual', novaChave); 

        fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enviarParaServidor)
        }).then(() => {
            if (msgSucesso) {
                msgSucesso.classList.add('mostrar'); 
                // Atualiza a idade no ecrã
                if (elIdade) elIdade.innerText = "Idade: " + calcularIdade(novaData) + " anos";
                
                setTimeout(() => { window.location.href = "menu_jogos.html"; }, 2000);
            }
        });
    });
}