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
    stars:{
        type:Number,
        required:true,
        default:0    
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
        required:true,
        ref: "Comments"
    }],
})

module.exports = model("Restaurant", RestaurantSchema)