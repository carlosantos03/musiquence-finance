let contasAtuais = []; 
let nivelAtual = 'facil';
let tempoInicio;

function voltarAosNiveis() {
    document.getElementById('ecra-niveis').style.display = 'block';
    document.getElementById('ecra-caderno').style.display = 'none';
}

function iniciarJogo(nivel) {
    nivelAtual = nivel;
    document.getElementById('ecra-niveis').style.display = 'none';
    document.getElementById('ecra-caderno').style.display = 'block';
    
    const etiqueta = document.getElementById('etiqueta-nivel');
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

    gerarContas();
}

function gerarContas() {
    const areaContas = document.getElementById('area-contas');
    areaContas.innerHTML = ''; 
    document.getElementById('mensagem-feedback').innerText = '';
    contasAtuais = [];
    let expressoesJaFeitas = []; 
    tempoInicio = new Date();

    const btn = document.querySelector('.btn-corrigir');
    btn.innerText = "Entregar as Respostas 📝";
    btn.style.backgroundColor = "#0984e3";
    btn.style.boxShadow = "0px 6px 0px #076bb8";
    btn.onclick = verificarRespostas;

    let numContas = 3;
    if(nivelAtual === 'medio') numContas = 4;
    if(nivelAtual === 'dificil') numContas = 5;

    let contasCriadas = 0; 
       
    while(contasCriadas < numContas) {
        let n1, n2, op, resultadoCerto;
        
        op = Math.random() > 0.5 ? '+' : '-'; 

        if (nivelAtual === 'facil') {
            if (op === '+') {
                n1 = Math.floor(Math.random() * 9) + 2; 
                n2 = Math.floor(Math.random() * 9) + 1; 
                resultadoCerto = n1 + n2;
            } else {
                n1 = Math.floor(Math.random() * 6) + 5; 
                n2 = Math.floor(Math.random() * (n1 - 1)) + 1; 
                resultadoCerto = n1 - n2;
            }
        } 
        else if (nivelAtual === 'medio') {
            n1 = Math.floor(Math.random() * 11) + 10; 
            n2 = Math.floor(Math.random() * 9) + 1; 
            resultadoCerto = op === '+' ? n1 + n2 : n1 - n2;
        } 
        else {
            const tiposOp = ['+', '-', 'x'];
            op = tiposOp[Math.floor(Math.random() * tiposOp.length)];
            
            if (op === 'x') {
                const tabuadasFaceis = [2, 3, 5, 10];
                n1 = tabuadasFaceis[Math.floor(Math.random() * tabuadasFaceis.length)];
                n2 = Math.floor(Math.random() * 8) + 2; 
                resultadoCerto = n1 * n2;
            } else {
                n1 = Math.floor(Math.random() * 31) + 20; 
                n2 = Math.floor(Math.random() * 10) + 1; 
                resultadoCerto = op === '+' ? n1 + n2 : n1 - n2;
            }
        }
        
        // CRIA A "ASSINATURA" DA CONTA (ex: "4+3")
        const assinaturaConta = `${n1}${op}${n2}`;
        
        // VERIFICA SE A CONTA JÁ EXISTE NESTA FOLHA
        if (expressoesJaFeitas.includes(assinaturaConta)) {
            continue; 
        }
        
        expressoesJaFeitas.push(assinaturaConta);
        contasAtuais.push(resultadoCerto);

        const div = document.createElement('div');
        div.className = 'linha-conta';
        div.innerHTML = `
            <span class="num1">${n1}</span> <span class="op" style="color: #ff7675;">${op}</span> <span class="num2">${n2}</span> <span>=</span>
            <input type="number" class="input-conta" id="resposta-${contasCriadas}" autocomplete="off">
        `;
        areaContas.appendChild(div);
        
        contasCriadas++; 
    }
}
function verificarRespostas() {
    const tempoFim = new Date();
    const tempoSegundos = Math.round((tempoFim - tempoInicio) / 1000);

    let acertos = 0;
    const totalContas = contasAtuais.length;

    for(let i = 0; i < totalContas; i++) {
        const input = document.getElementById(`resposta-${i}`);
        const divLinha = input.parentElement; // Apanha a "linha" inteira da conta
        const respostaIdoso = parseInt(input.value);
        const respostaCerta = contasAtuais[i];

        input.disabled = true; 

        if (respostaIdoso === respostaCerta) {
            acertos++;
            input.style.borderColor = '#00b894'; 
            input.style.backgroundColor = '#e8f8f5';
            
            const certinho = document.createElement('span');
            certinho.innerText = '✅';
            certinho.style.fontSize = '2rem';
            certinho.style.marginLeft = '10px';
            divLinha.appendChild(certinho);
            
        } else {
            input.style.borderColor = '#d63031'; 
            input.style.backgroundColor = '#fdf0ed';
            input.style.color = '#d63031';

            const correcao = document.createElement('span');
            correcao.innerText = `👈 Era ${respostaCerta}`;
            correcao.style.color = '#d63031';
            correcao.style.fontSize = '1.8rem';
            correcao.style.fontWeight = 'bold';
            correcao.style.marginLeft = '10px';
            
            divLinha.appendChild(correcao);
        }
    }

    const errosNesteJogo = totalContas - acertos;
    const feed = document.getElementById('mensagem-feedback');
    
    // 3. MENSAGEM FINAL
    if (acertos === totalContas) {
        feed.innerText = `🌟 100% Certo! Demorou ${tempoSegundos} segundos.`;
        feed.style.color = "#00b894";
    } else {
        feed.innerText = `📝 Entregue! Acertou ${acertos} de ${totalContas} em ${tempoSegundos}s.`;
        feed.style.color = "#d63031";
    }

    // 4. TRANSFORMA O BOTÃO EM "PRÓXIMA FOLHA"
    const btn = document.querySelector('.btn-corrigir');
    btn.innerText = "Próxima Folha ➡️";
    btn.style.backgroundColor = "#00b894"; // Fica verde
    btn.style.boxShadow = "0px 6px 0px #008f73";
    btn.onclick = gerarContas;

    // ==========================================
    // 5. GUARDA NA BASE DE DADOS O RESULTADO EXATO
    // ==========================================
    const sessao = localStorage.getItem('sessaoAtual');
    let bd = JSON.parse(localStorage.getItem('bd_pacientes')) || {};
    
    if (sessao && bd[sessao]) {
        if (!bd[sessao].historico_matematica) {
            bd[sessao].historico_matematica = [];
        }
        
        bd[sessao].historico_matematica.push({
            data: new Date().toLocaleString('pt-PT'),
            nivel: nivelAtual,
            tempo_segundos: tempoSegundos,
            erros: errosNesteJogo,
            acertos: acertos,
            total_contas: totalContas
        });

        localStorage.setItem('bd_pacientes', JSON.stringify(bd));
        fetch('/api/guardar', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(bd) 
        });
    }
}