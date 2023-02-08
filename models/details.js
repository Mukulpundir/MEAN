var mongoose = require('mongoose');

var loginSchema = mongoose.Schema({
    heading: String,
    para: String,
    image: 
    {
        data: Buffer,
        contentType: String
    }
    
 });
 var Login = mongoose.model("meanDB", loginSchema);
 module.exports = Login;