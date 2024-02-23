const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let pessoas = [
    { name: 'aaa', email: 'a@a', password: '123' },
    { name: 'gabriel', email: 'gabriel@gmail.com', password: '143' },
    { name: 'carlos', email: 'carlos@gmail.com' , password: '694' }
];



// Transições de processos (eventos) da aplicação web ; 

app.get('/', (req, res) => res.render('index'));

app.get('/login', (req, res) => res.render('login', { erro: '' }));

app.post('/login', (req, res) => {
    let usuarioErrado = true;

    if (req.body.password.trim().replace(/ +/g, '') !== req.body.password) {
        return res.render('login', { erro: 'Senha não pode conter espaços' });
    }

    for(let i = 0 ; i < pessoas.length ; i++){
        if(pessoas[i].email === req.body.email && pessoas[i].password === req.body.password){
            res.render('loginEfetuado', { name: pessoas[i].name });
            console.log('Email:' + pessoas[i].email + '/' + 'senha:' + pessoas[i].password + '/' + 'Status : usuário logado');
            usuarioErrado = false;
            break;
        }
    }

    if (usuarioErrado) {
        return res.render('login', { erro: 'Usuário não encontrado' });
    }
});

app.get('/cadastro', (req, res) => res.render('cadastro', { erro:'' }));

app.post('/cadastro', (req, res) => {
    if (req.body.password === req.body.password_confirm) {
        res.redirect('/login');
        pessoas.push({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    }
    else {
        res.render('cadastro', { erro: 'Senhas não são iguais' });
    }
});

app.get('/lista', (req, res) => res.render('lista'));

app.post('/lista/json', (req, res) => {
    const userIndex = pessoas.findIndex(user => user.name === req.body.name && user.email === req.body.email);
    pessoas.splice(userIndex, 1);
    return res.status(204).json()
});

app.get('/lista/json', (req, res) => {
    res.status(200).json({
        pessoas: pessoas.map(user => {
            return { name: user.name, email: user.email }
        })
    });
});

// app.listen(3000, () => console.log('Server ready'));

module.exports = app;
