var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var receberSchema = new Schema({

    nome: String,
    numero: String,
    descricao: String,
    imagem: String,
    

},{collection:'recebidos'})

var Recebidos = mongoose.model('recebidos',receberSchema);

module.exports = Recebidos;
