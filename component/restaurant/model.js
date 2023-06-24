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
    adminRecomendation:{
        type:Boolean,
        default:false
    },
    image:{
        type: String,
        default: 'no-image'
    },
    userType: {
        type: String,
        default: 'Restautante'
    }
})

module.exports = model("Restaurant", RestaurantSchema)