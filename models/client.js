const {model, Types, Schema} = require("mongoose")

var ClientSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required:true
    }

})

module.exports = model("Client", ClientSchema)