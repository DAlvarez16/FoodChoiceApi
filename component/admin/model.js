const {Schema, Types, model} = require('mongoose')

const AdminSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password:{
        type: String,
    }
},{
    timestamps: true,
    strict: false
})

module.exports = model('Admin', AdminSchema)

