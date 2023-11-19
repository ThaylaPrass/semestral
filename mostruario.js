var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var mostruarioSchema = new Schema({

    imagem: String,
    texto: String,
    

},{collection:'mostruario'})

var Mostruario = mongoose.model('mostruario',mostruarioSchema);

module.exports = Mostruario;
