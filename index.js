// Importações (npm i ...)
// express
// express-session
// nodemon -D

// Nº da porta
const porta = 4000;

// Express
const express = require('express');
const app = express();

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

app.get('/estoque', (req, res)=>{
    if (req.session.email){
        res.sendFile(__dirname + '/estoque.html');
    } else {
        res.redirect('/');
    }
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
