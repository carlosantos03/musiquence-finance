// ==========================================
// 1. CARREGAR DADOS QUANDO A PÁGINA ABRE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const sessaoAtual = localStorage.getItem('sessaoAtual'); 
    let bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

    if (sessaoAtual && bd_pacientes[sessaoAtual]) {
        const dadosPaciente = bd_pacientes[sessaoAtual];
        const nomeReal = dadosPaciente.nome;

        // --- A) PREENCHER O FORMULÁRIO (O que tinha desaparecido!) ---
        const inputNome = document.getElementById('edit-nome');
        const inputData = document.getElementById('edit-data');
        const txtIdade = document.getElementById('idade-jogador');

        if (inputNome) inputNome.value = dadosPaciente.nome || '';
        if (inputData) {
            inputData.value = dadosPaciente.dataNascimento || '';
            
            // Calcular e mostrar a idade
            if (dadosPaciente.dataNascimento) {
                const hoje = new Date();
                const nasc = new Date(dadosPaciente.dataNascimento);
                let idade = hoje.getFullYear() - nasc.getFullYear();
                const mes = hoje.getMonth() - nasc.getMonth();
                if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
                    idade--;
                }
                if (txtIdade) txtIdade.innerText = `Idade: ${idade} anos`;
            }
        }

        // --- B) ATUALIZAR NOMES NO ECRÃ ---
        const spanNomeSaudacao = document.getElementById('nome-jogador');
        const h3NomeSidebar = document.getElementById('nome-sidebar');
        
        if (spanNomeSaudacao) {
            const partesNome = nomeReal.trim().split(/\s+/);
            let nomeCurto = nomeReal;
            if (partesNome.length > 1) {
                nomeCurto = partesNome[0] + " " + partesNome[partesNome.length - 1];
            }
            spanNomeSaudacao.innerText = nomeCurto; 
        }

        if (h3NomeSidebar) {
            h3NomeSidebar.innerText = nomeReal;
        }

        // --- C) ATUALIZAR FOTOGRAFIA ---
        if (dadosPaciente.foto) {
            const avatar = document.getElementById('abrir-perfil');
            const avatarSidebar = document.getElementById('avatar-sidebar');
            const avatarPriv = document.getElementById('avatar-preview-privacidade');
            
            if (avatar) {
                avatar.style.backgroundImage = `url('${dadosPaciente.foto}')`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.color = 'transparent'; 
            }
            if (avatarSidebar) {
                avatarSidebar.style.backgroundImage = `url('${dadosPaciente.foto}')`;
                avatarSidebar.classList.add('com-foto');
                avatarSidebar.innerText = "";
            }
            if (avatarPriv) {
                avatarPriv.style.backgroundImage = `url('${dadosPaciente.foto}')`;
                avatarPriv.classList.add('com-foto');
                avatarPriv.innerText = "";
            }
        }
    }
});

// ==========================================
// 2. GUARDAR ALTERAÇÕES DO FORMULÁRIO (Nome e Data)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const formularioPerfil = document.getElementById('formulario-privacidade');

    if (formularioPerfil) {
        formularioPerfil.addEventListener('submit', async function(evento) {
            evento.preventDefault(); // Trava o reload automático do HTML

            const inputNome = document.getElementById('edit-nome');
            const inputData = document.getElementById('edit-data');
            const sessaoAtual = localStorage.getItem('sessaoAtual');

            const novoNome = inputNome.value.trim();
            const novaData = inputData.value;
            
            // --- INÍCIO DAS VERIFICAÇÕES IGUAIS À AUTENTICAÇÃO ---
            let mensagemTexto = ""; 
            let temErro = false;    

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

            // Se detetou algum erro, mostra a mensagem e para por aqui!
            if (temErro) {
                mostrarMensagemErro(mensagemTexto);
                return; 
            }
            // --- FIM DAS VERIFICAÇÕES ---

            let bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};

            if (sessaoAtual && bd_pacientes[sessaoAtual]) {
                const novaChaveUnica = novoNome + "_" + novaData;

                // Se a chave mudou 
                if (novaChaveUnica !== sessaoAtual) {
                    // 1. Criamos a nova gaveta com os dados todos da antiga
                    bd_pacientes[novaChaveUnica] = bd_pacientes[sessaoAtual];
                    
                    // 2. Atualizamos o nome e data lá dentro
                    bd_pacientes[novaChaveUnica].nome = novoNome;
                    bd_pacientes[novaChaveUnica].dataNascimento = novaData;
                    
                    // 3. Apagamos a gaveta antiga marcando como null para o servidor a apagar
                    bd_pacientes[sessaoAtual] = null; 
                    
                    // 4. Atualizamos a sessão atual do navegador
                    localStorage.setItem('sessaoAtual', novaChaveUnica);
                } else {
                    // Se não mudou a chave (só carregou em guardar sem alterar o base), atualiza normal
                    bd_pacientes[sessaoAtual].nome = novoNome;
                    bd_pacientes[sessaoAtual].dataNascimento = novaData;
                }
                
                localStorage.setItem('bd_pacientes', JSON.stringify(bd_pacientes));

                try {
                    // 1. Guarda no servidor
                    await fetch('/api/guardar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bd_pacientes)
                    });
                    
                    // 2. Mostra a mensagem
                    mostrarMensagemSucesso("✅ Dados guardados com sucesso!");
                    
                    // 3. ATUALIZA O ECRÃ EM TEMPO REAL (Sem Reload!)
                    
                    // Atualiza Nome na Barra Lateral
                    const h3NomeSidebar = document.getElementById('nome-sidebar');
                    if (h3NomeSidebar) h3NomeSidebar.innerText = novoNome;

                    // Atualiza Nome Curto na Saudação (ex: "Carlos Santos")
                    const spanNomeSaudacao = document.getElementById('nome-jogador');
                    if (spanNomeSaudacao) {
                        const partesNome = novoNome.trim().split(/\s+/);
                        let nomeCurto = novoNome;
                        if (partesNome.length > 1) {
                            nomeCurto = partesNome[0] + " " + partesNome[partesNome.length - 1];
                        }
                        spanNomeSaudacao.innerText = nomeCurto; 
                    }

                    // Recalcula e atualiza a Idade no ecrã
                    const txtIdade = document.getElementById('idade-jogador');
                    if (txtIdade && novaData) {
                        const hoje = new Date();
                        const nasc = new Date(novaData);
                        let idade = hoje.getFullYear() - nasc.getFullYear();
                        const mes = hoje.getMonth() - nasc.getMonth();
                        if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
                            idade--;
                        }
                        txtIdade.innerText = `Idade: ${idade} anos`;
                    }

                } catch (erro) {
                    console.error("Erro ao guardar:", erro);
                    mostrarMensagemErro("❌ Ocorreu um erro ao comunicar com o servidor.");
                }
            }
        });
    }
});

// ==========================================
// 3. UPLOAD DA FOTO DE PERFIL
// ==========================================
const inputFoto = document.getElementById('upload-foto');

if (inputFoto) {
    inputFoto.addEventListener('change', async function(evento) {
        const ficheiro = evento.target.files[0];
        if (!ficheiro) return;

        const sessaoAtual = localStorage.getItem('sessaoAtual');
        if (!sessaoAtual) {
            alert("Erro: Sessão não encontrada.");
            return;
        }

        const formData = new FormData();
        formData.append('foto', ficheiro);
        formData.append('sessao', sessaoAtual); 

        try {
            const avatarPriv = document.getElementById('avatar-preview-privacidade');
            if (avatarPriv) avatarPriv.innerText = "⏳";

            const resposta = await fetch('/api/upload-perfil', {
                method: 'POST',
                body: formData 
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                const caminhoNovaFoto = resultado.caminhoFicheiro;

                let bd_pacientes = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
                bd_pacientes[sessaoAtual].foto = caminhoNovaFoto; 

                localStorage.setItem('bd_pacientes', JSON.stringify(bd_pacientes));

                await fetch('/api/guardar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bd_pacientes)
                });

                if (avatarPriv) {
                    avatarPriv.style.backgroundImage = `url('${caminhoNovaFoto}')`;
                    avatarPriv.style.backgroundSize = 'cover';
                    avatarPriv.classList.add('com-foto');
                    avatarPriv.innerText = "";
                }

                mostrarMensagemSucesso("📸 Fotografia atualizada com sucesso!");

            } else {
                mostrarMensagemErro("Erro ao guardar: " + resultado.erro);
                if (avatarPriv) avatarPriv.innerText = "👤"; 
            }

        } catch (erro) {
            console.error("Falha ao comunicar com o servidor:", erro);
            mostrarMensagemErro("O servidor está desligado. Não foi possível guardar a foto.");
            const avatarPriv = document.getElementById('avatar-preview-privacidade');
            if (avatarPriv) avatarPriv.innerText = "👤";
        }
    });
}
// ==========================================
// 4. FUNÇÕES DE MENSAGENS (Mais robustas!)
// ==========================================
// Usamos "window." para garantir que estas funções funcionam sempre, em qualquer lado
window.mostrarMensagemSucesso = function(mensagem) {
    const div = document.getElementById('mensagem-sucesso');
    if (div) {
        div.innerText = mensagem;
        div.style.display = 'block';
        div.style.opacity = '1';
        div.style.visibility = 'visible';
        div.style.zIndex = '9999'; 
        div.classList.add('mostrar'); 

        // Esconde a mensagem logo antes de a página recarregar
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.display = 'none';
        }, 2400); 
    } else {
        alert(mensagem);
    }
}

window.mostrarMensagemErro = function(mensagem) {
    const div = document.getElementById('mensagem-erro');
    if (div) {
        div.innerText = mensagem;
        
        div.style.display = 'block';
        div.style.opacity = '1';
        div.style.visibility = 'visible';
        div.style.zIndex = '9999';
        div.classList.add('mostrar');

        setTimeout(() => {
            div.style.opacity = '0';
            div.style.display = 'none';
        }, 3000);
    } else {
        alert(mensagem);
    }
}