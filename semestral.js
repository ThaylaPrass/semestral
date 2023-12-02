const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fileupload = require('express-fileupload')
const path = require('path');
const { fstat } = require('fs')
mongoose.set('strictQuery', false);

const app = express();


var session = require('express-session');
const fileUpload = require('express-fileupload');
///////////////////////////////PkpANocvrY8M1OSd/////////////////////////// conexao com o mongo
mongoose.connect('mongodb+srv://davidbatistaa1:PkpANocvrY8M1OSd@cluster0.cb7zhkh.mongodb.net/projetoFasipe?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('\n BANCO DE DADOS CONECTADO \n')
}).catch(function(err){
    console.log(err.message)
})
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const Galeria =  require('./galeria.js')
const Mostruario =  require('./mostruario.js')
const Recebidos =  require('./receber.js')



app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}))
//////////////////////////////////////////////////////////

app.use(session({secret: 'keyboard cat', cookie: {maxAgre: 60000}}))


//////////////////////////////////////////////////////////receita padrao
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));
//////////////////////////////////////////////////////////


app.get('/', (req, res) => {
    Galeria.find({}).sort({ '_id': -1 }).exec(function (err, galeria) {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar dados da galeria');
        } else {
            const galeriaData = galeria.map(function (val) {
                return {
                    imagem: val.imagem,
                }
            });

            Mostruario.find({}).exec(function (err, mostruario) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Erro ao buscar dados do mostruário');
                } else {
                    const mostruarioData = mostruario.map(function (val) {
                        return {
                            texto: val.texto,
                            imagem: val.imagem,
                        }
                    });

                    res.render('home', { galeria: galeriaData, mostruario: mostruarioData });
                }
            });
        }
    });
});

app.get('/',(req,res)=>{
     
})


app.get('/:slug',(req,res)=>{
    
})

var usuarios = [
    {
        login: 'thayla',
        senha: '102030'
    }
]

app.post('/admin/login',(req,res)=>{
    usuarios.map(function(val){
        if(val.login == req.body.login && val.senha == req.body.senha){
            req.session.login = "david";
        }
    
    })

    res.redirect('/admin/login');

})



app.post('/admin/cadastroGalery',(req,res)=>{
    

    // let formato = req.files.arquivo.name.split('.')
    // var imagem = ''
    // if(formato[formato.length - 1] == "jpeg"  ){
    //     imagem = new Date().getTime()+'.jpeg'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
    // }else if( formato[formato.length - 1] == "png"){
    //     imagem = new Date().getTime()+'.png'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
        
    // }else if(formato[formato.length - 1] == "jpg"){
    //     imagem = new Date().getTime()+'.jpg'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
        
    // }else{
    //     fs.unlinkSync(req.files.arquivo.tempFilePath)

    // }
    Galeria.create({
        // imagem: 'http://localhost:5000/public/images/'+ imagem,
        imagem: req.body.link,
        
    })
    
    res.redirect('/admin/login')
})


app.get('/admin/deletarGalery/:id',(req,res)=>{
    Galeria.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin/login')
    })
   
})
app.post('/admin/cadastroMost',(req,res)=>{
    

    // let formato = req.files.arquivo.name.split('.')
    // var imagem = ''
    // if(formato[formato.length - 1] == "jpeg"  ){
    //     imagem = new Date().getTime()+'.jpeg'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
    // }else if( formato[formato.length - 1] == "png"){
    //     imagem = new Date().getTime()+'.png'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
        
    // }else if(formato[formato.length - 1] == "jpg"){
    //     imagem = new Date().getTime()+'.jpg'
    //     req.files.arquivo.mv(__dirname+'/public/images/'+ imagem)
        
    // }else{
    //     fs.unlinkSync(req.files.arquivo.tempFilePath)

    // }
   
    Mostruario.create({
        
        texto: req.body.textoMost,
        // imagem: 'http://localhost:5000/public/images/'+ imagem,
        imagem: req.body.linkImg,
        
    })
    res.redirect('/admin/login')
})


app.get('/admin/deletarMost/:id',(req,res)=>{
    Mostruario.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin/login')
    })
})

app.post('/page/shareclientes',(req,res)=>{
    
    let formato = req.files.arqcliente.name.split('.')
    var imagem = ''
    
    const formatosDiretorios = {
        jpeg: '/public/images/',
        jpg: '/public/images/',
        png: '/public/images/',
        cdr: '/public/cdr/',
        rar: '/public/rar/',
        zip: '/public/rar/',
        ai: '/public/cdr/'
    };
    
    const formatoValido = formato[formato.length - 1];
    
    if (formatoValido && formatosDiretorios[formatoValido]) {
        const extensao = formatoValido === 'jpeg' ? 'jpg' : formatoValido;
        imagem = new Date().getTime() + '.' + extensao;
        const diretorio = formatosDiretorios[formatoValido];
        req.files.arqcliente.mv(__dirname + diretorio + imagem);
    
        Recebidos.create({
            nome: req.body.nome,
            numero: req.body.numero,
            descricao: req.body.texto,
            imagem: diretorio.includes('images') ? 'http://localhost:5000/public/images/' + imagem : null,
        });

        const nomeUsuario = req.body.nome.replace(/\s/g, '_');
        const nomeArquivo = nomeUsuario + '_' + new Date().getTime() + '.' + extensao;
        imagem = nomeArquivo;
    
        res.redirect('/page/contato');
    } else {
        Recebidos.create({
            nome: req.body.nome,
            numero: req.body.numero,
            descricao: req.body.texto,
            imagem: null,
        });
    
        fs.unlinkSync(req.files.arqcliente.tempFilePath);
        res.redirect('/page/contato');
    }
  
})

app.get('/download/:nomeArquivo', function(req, res) {
    const nomeArquivo = req.params.nomeArquivo;
    const caminhoArquivo = '/public/rar/' + nomeArquivo;

    res.download(caminhoArquivo, nomeArquivo, function(err) {
        if (err) {
            res.status(404).send('Arquivo não encontrado');
        }
    });
});

app.get('/admin/deletarMost/:id',(req,res)=>{
    Mostruario.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin/login')
    })
})


app.get('/admin/login',(req,res)=>{
    if(req.session.login == null){
        res.render('admin-login')
        
    }else{
        Galeria.find({}).sort({'_id': -1}).exec(function(err,galeria){
            //console.log(posts[0])
            galeria = galeria.map(function(val){
                return{
                    id: val._id,
                    imagem: val.imagem,
                   
                    
                }
            })

            Mostruario.find({}).sort({'_id': -1}).exec(function(err,mostruario){
                //console.log(posts[0])
                mostruario = mostruario.map(function(val){
                    return{
                        id: val._id,
                        texto: val.texto,
                        imagem: val.imagem,
                       
                        
                    }
                })
                res.render('admin-painel',{mostruario:mostruario,galeria:galeria});
                
            })
           
            
        })
        // res.render('admin-painel',{posts:posts});
    }
})


app.get('/page/quem', (req,res)=>{
    res.render('pagequemsomos')
})
app.get('/page/contato',(req, res)=>{
    res.render('contato')
})
app.get('/admin/clientes',(req,res)=>{
    Recebidos.find({}).exec(function (err, recebidos) {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar dados do mostruário');
        } else {
            const recebidosData = recebidos.map(function (val) {
                return {
                    nome: val.nome,
                    numero: val.numero,
                    descricao: val.descricao,
                    imagem: val.imagem,
                }
            });

            // Renderize a página com os dados da galeria e do mostruário
            res.render('admin-clientes', {recebidos: recebidosData });
        }
    });
    // res.render('admin-clientes')
})


app.listen(5000,()=>{
    console.log('\n SERVIDOR RODANDO \n');
})