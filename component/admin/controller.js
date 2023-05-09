const { request, response } = require('express')
const AdminModel = require('./model')
const bcrypt = require('bcryptjs')

async function create(req=request, res= response){

    try {
        //requerir del body el usuario y contraseña
        const {username,password}= req.body
        //verificar que no exista el usuario
        var admin = await AdminModel.findOne({
            username
        })
        if(admin){
            return res.status(200).json({
                msg:"Usuario ya existe"
            })
        }
        //encriptar contraseña
         var salt = bcrypt.genSaltSync(6)
         var hash = bcrypt.hashSync(password, salt)

        //guardar en la base de datos
        await AdminModel.create({
            username,
            password:hash
        })
        return res.status(201).json({
            msg:"Usuario creado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            msg:"Error interno del servidor,motivo: "+error
        })
    }
}

async function signIn(req = request, res = response) {
    try {
        //requerir el body usuario y contraseña
        const { username, password } = req.body

        //evaluar si el usuario existe
        var admin = await AdminModel.findOne({
            username
        })

        if (!admin) {
            return res.status(404).json({
                msg: "usuario o contraseña incorrectos"
            })
        }
        //si el usuario existe, evaluar si la contraseña coincide
        var passwordDecrypted = bcrypt.compareSync(password, admin.password)
        if (!passwordDecrypted) {
            return res.status(404).json({
                msg: "usuario o contraseña incorrectos"
            })
        }
        //Si todo esta correcto dejar pasar al admin
        return res.status(200).json({
            msg: "Bienvenido",
            admin
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor: " + error
        })
    }
}

module.exports = { signIn,create }
