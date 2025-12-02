// Importações (npm i ...)
// express
// express-session
// nodemon -D

// Nº da porta
const porta = 4000;

// Express
const express = require('express');
const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Session
const session = require('express-session')
app.use(session({
    secret:'qualquercoisanadaave',
    resave:false,
    saveUninitialized:false
}));

// Uso do JSON
app.use(express.json());

// Uso do URLEncoded - extendido
app.use(express.urlencoded({extended:true}))

// Consulta o Banco de Dados (empresa)
const bd = require('./bd')

// Bota o server pra funcionar
app.listen(porta);

app.get('/', (req, res)=>{
    if (req.session.email){
        res.sendFile(__dirname + '/main.html');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})

app.get('/main', (req, res)=>{
    if (req.session.email){
        res.sendFile(__dirname + '/main.html');
    } else {
        res.redirect('/');
    }
})

app.get('/cadastro', (req, res)=>{
    if (req.session.email){
        res.sendFile(__dirname + '/cadastro.html');
    } else {
        res.redirect('/');
    }
})

app.get('/estoque', async (req, res)=>{
    if (!req.session.email) return res.redirect('/');

    const [produtos] = await bd.query("SELECT * FROM produtos");

    res.render('estoque', { produtos });
})

app.post('/', (req, res) =>{
    // resgata o email e senha
    const{ email, senha } = req.body
    
    // verifica e redireciona conforme a veracidade
    if( email == "senai@senai.com" && senha == "senha" ){
        req.session.email = email;
        res.redirect('/main');
    } else {
        res.redirect('/');
    }
});

app.post('/cadastrar', async (req, res) =>{
    try{
        const { nome, categoria, codigo, quant, preco, descricao } = req.body;

        const sql = `INSERT INTO produtos (nome, categoria, codigo, quant, preco, descricao) VALUES (?, ?, ?, ?, ?, ?)`;

        await bd.query(sql, [ nome, categoria, codigo, quant, preco, descricao]);

        res.redirect('/estoque');

    } catch (erro){
        console.error("Erro ao cadastrar:", erro);
        res.status(500).json({
            status: 500,
            msg: "Erro no servidor!"
        });
    }
});
