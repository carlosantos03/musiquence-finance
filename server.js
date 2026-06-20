// server.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORTA = 3000;

// Garante que a pasta existe dentro da public para o HTML conseguir ler
const pastaDestino = path.join(__dirname, 'public', 'img', 'perfil');
if (!fs.existsSync(pastaDestino)){
    fs.mkdirSync(pastaDestino, { recursive: true });
}

const armazenamento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaDestino); 
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        const nomeFicheiro = 'perfil_' + Date.now() + extensao; 
        cb(null, nomeFicheiro);
    }
});
const upload = multer({ storage: armazenamento });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));

app.post('/api/guardar', (req, res) => {
    const dadosRecebidos = req.body;
    const caminhoBD = path.join(__dirname, 'bd_pacientes.json'); 
    
    let baseDeDados = {};
    
    if (fs.existsSync(caminhoBD)) {
        const ficheiroLido = fs.readFileSync(caminhoBD, 'utf8');
        if (ficheiroLido) {
            baseDeDados = JSON.parse(ficheiroLido);
        }
    }

    baseDeDados = { ...baseDeDados, ...dadosRecebidos };

    for (let chave in baseDeDados) {
        if (baseDeDados[chave] === null) {
            delete baseDeDados[chave];
        }
    }

    fs.writeFileSync(caminhoBD, JSON.stringify(baseDeDados, null, 2));
    res.json({ sucesso: true });
});

app.post('/api/upload-perfil', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: 'Nenhuma imagem enviada.' });
    }
    
    // Devolve apenas o caminho relativo para o HTML
    res.json({ 
        mensagem: 'Foto guardada com sucesso!', 
        caminhoFicheiro: 'img/perfil/' + req.file.filename 
    });
});

app.get('/api/dados', (req, res) => {
    const caminhoBD = path.join(__dirname, 'bd_pacientes.json'); 
    
    if (fs.existsSync(caminhoBD)) {
        const ficheiroLido = fs.readFileSync(caminhoBD, 'utf8');
        res.json(JSON.parse(ficheiroLido)); 
    } else {
        res.json({}); 
    }
});

app.listen(PORTA, () => {
    console.log(`🚀 Servidor do MQ Finance a rodar com sucesso!`);
    console.log(`👉 Abre o teu navegador e vai a: http://localhost:${PORTA}`);
});