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
    },
    comments:[{
        type:Types.ObjectId,
        ref:"Comments"
    }],
    stars:[{
        type:Types.ObjectId,
        ref: "Stars"
    }],
    userType: {
        type: String,
        default: 'Cliente'
    }
})

module.exports = model("Client", ClientSchema)