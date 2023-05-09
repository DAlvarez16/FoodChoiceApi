const {model, Types, Schema} = require("mongoose")

var RestaurantSchema = new Schema({
    nit:{
        type:String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true,
    },
    address:{
        type: String,
        required:true,
    },
    phone:{
        type: String,
        required:true,
    },
    products:[{
        type: Types.ObjectId,
        ref: 'Products'
    }],
    restaurantType:{
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

module.exports = model("Restaurant", RestaurantSchema)