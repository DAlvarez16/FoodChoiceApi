var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://carlosmpz:Dw2EYrpcoJ1bPtlI@cluster0.xfrvl9b.mongodb.net/food_choice?retryWrites=true&w=majority")
.then(()=>{
    console.log('Conexion exitosa con la base de datos')
}).catch((err)=>{
    console.log("Error al conectar con la base de datos, motivo: " + err)
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/admin",require("./routes/admin"))
app.use("/api/restaurant",require("./routes/restaurant"))



module.exports = app;
