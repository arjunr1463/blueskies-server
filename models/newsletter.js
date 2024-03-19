const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
});

//Export the model
module.exports = mongoose.model('Newsletter', userSchema);