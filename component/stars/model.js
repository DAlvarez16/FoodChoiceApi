const {model, Types, Schema} = require("mongoose")

var StarsSchema = new Schema({
    idClient:{
        type:Types.ObjectId,
        ref:"Client",
        required: true
    },
    idRestaurant:{
        type: Types.ObjectId,
        ref:"Restaurant",
        required: true
    },
    stars:{
        type: Number,
        required:true
    }
})

module.exports = model("Stars", StarsSchema)