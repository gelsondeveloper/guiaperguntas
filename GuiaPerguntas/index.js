const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/perguntaModel");
const Resposta = require("./database/respostaModel");
const port = 8080;

//Conexão com o banco de dados 
connection
.authenticate()
.then(() => {
    console.log("Conexão feita com o banco de dados");
})
.catch((msgErro) => {
    console.log(msgErro)
})


//Usando o EJS como view engine para renderizar o HTML 
app.set("view engine", 'ejs');
app.use(express.static('public'));

//Usando o body-parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/",(req,res) => {
    Pergunta.findAll({row: true, order: [
        ['id','DESC']//Ordenação decrescente pelo ID
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        }); 
    });
    
});

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) {//Pergunta foi encontrada
            Resposta.findAll({
                where: {perguntaId: id},
                order: [['id', 'DESC']]
            }).then( respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            }); 
        } else {//Pergunta não foi encontrada
            res.redirect("/");
        }
    });
});



app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;
    Pergunta.create(
        {
            titulo: titulo,
            descricao: descricao
        }
        ).then(() => {
            res.redirect("/");
        }); 
    });
    
    app.post("/responder", (req, res) => {
        let corpo = req.body.corpo;
        let perguntaId = req.body.pergunta;
        Resposta.create({
            corpo: corpo,
            perguntaId: perguntaId
        }).then(()=>{
            res.redirect("/pergunta/"+perguntaId);
        });
    });
    
    app.listen(port, function () {
        console.log("Rodando na porta: "+port);
    });
    
    
    
    