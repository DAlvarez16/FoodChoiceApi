const {model, Types, Schema} = require("mongoose")

var CommentSchema = new Schema({
    idClient:{
        type:Types.ObjectId,
        ref:"Client",
    },
    idAdmin:{
        type:Types.ObjectId,
        ref:"Admin",
    },
    idRestaurant:{
        type: Types.ObjectId,
        ref:"Restaurant",
        required: true
    },
    text:{
        type: String,
        required:true
    }
})

module.exports = model("Comments", CommentSchema)