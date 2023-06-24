const { request, response } = require('express')
const ClientModel = require('./model')
const bcrypt = require('bcryptjs')

async function signUp(req=request, res= response){

    try {
        //requerir del body el usuario y contraseña
        const {name,username,password}= req.body
        //verificar que no exista el usuario
        var Client = await ClientModel.findOne({
            username
        })
        if(Client){
            return res.status(200).json({
                msg:"Usuario ya existe",
                code:409
            })
        }
        //encriptar contraseña
         var salt = bcrypt.genSaltSync(6)
         var hash = bcrypt.hashSync(password, salt)

        //guardar en la base de datos
        await ClientModel.create({
            name,
            username,
            password:hash
        })
        return res.status(201).json({
            msg:"Usuario creado correctamente",
            code:201
        })

    } catch (error) {
        return res.status(500).json({
            msg:"Error interno del servidor,motivo: "+error,
            code: 500
        })
    }
}

async function signIn(req = request, res = response) {
    try {
        //requerir el body usuario y contraseña
        const { username, password } = req.body

        //evaluar si el usuario existe
        var client = await ClientModel.findOne({
            username
        })

        if (!client) {
            return res.status(200).json({
                msg: "usuario o contraseña incorrectos",
                code: 404
            })
        }
        //si el usuario existe, evaluar si la contraseña coincide
        var passwordDecrypted = bcrypt.compareSync(password, client.password)
        if (!passwordDecrypted) {
            return res.status(200).json({
                msg: "usuario o contraseña incorrectos",
                code: 401
            })
        }
        //Si todo esta correcto dejar pasar al admin
        return res.status(200).json({
            msg: "Bienvenido",
            client,
            code: 200
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor: " + error
        })
    }
}

async function getClient(req = request, res = response) {
    try {
        //requerir el body usuario y contraseña
        const { id } = req.params

        //evaluar si el usuario existe
        var client = await ClientModel.findById(id)

        if (!client) {
            return res.status(200).json({
                msg: "usuario no existe",
                code: 404
            })
        }
        //Si todo esta correcto retorna al cliente
        return res.status(200).json({
            msg: "Cliente encontrado",
            client,
            code: 200
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor: " + error
        })
    }
}

module.exports = { signIn,signUp, getClient }
