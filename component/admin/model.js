const {Schema, Types, model} = require('mongoose')

const AdminSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password:{
        type: String,
    },
    userType: {
        type: String,
        default: 'Admin'
    },
    comments:[{
        type:Types.ObjectId,
        ref:"Comments"
    }]
},{
    timestamps: true,
    strict: false
})

module.exports = model('Admin', AdminSchema)

