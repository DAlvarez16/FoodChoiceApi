var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://dalvarezr:X5cqaGMm3z98gFPm@cluster0.rde0ke0.mongodb.net/foodchoice?retryWrites=true&w=majority")
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
app.use(cors())
app.use("/api/admin",require("./component/admin/route"))
app.use("/api/restaurant",require("./component/restaurant/route"))
app.use("/api/client",require("./component/cliente/route"))
app.use("/api/comment",require("./component/comments/route"))



module.exports = app;
