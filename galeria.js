var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var galeriaSchema = new Schema({

    imagem: String,
    

},{collection:'galeria'})

var Galeria = mongoose.model('galeria',galeriaSchema);

module.exports = Galeria;