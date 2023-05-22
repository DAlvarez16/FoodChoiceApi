const { request, response } = require("express")
const restaurantModel = require("./model")
const CommentModel = require("../comments/model")
const ClientModel = require("../cliente/model")
const StarsModel = require("../stars/model")
const bcrypt = require("bcryptjs")

async function create(req = request, res = response) {
    try {
        //requiriendo los datos del body
        const { nit, name, description, address, phone, restaurantType, username, password } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findOne({ nit })
        //Si existe respuesta de negacion
        if (restaurant) {
            return res.status(409).json({
                msg: "Este restaurante ya existe",
                code: 409,
                status: false
            })
        }

        //encriptar contraseña
        var salt = bcrypt.genSaltSync(6)
        var hash = bcrypt.hashSync(password, salt)

        //si no existe crea el restaurante
        await restaurantModel.create({
            nit,
            name,
            description,
            address,
            phone,
            restaurantType,
            username,
            password: hash
        })
        //respuesta exitosa
        return res.status(200).json({
            msg: "Restaurante creado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }

}

async function findRestaurants(req = request, res = response) {
    try {
       
        //validar que el restaurante no exista en la base de datos
        const restaurants = await restaurantModel.find()
        //Si existe respuesta de negacion
        if (restaurants.length == 0) {
            return res.status(409).json({
                msg: "No existen restaurantes registrados",
                code: 404,
                status: false
            })
        }
        
        
        //respuesta exitosa
        return res.status(200).json({
            msg: "Restaurantes encontrados ",
            code: 200,
            status: true,
            restaurants
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+ error,
            code: 500,
            status: "error"
        })
    }

}

async function findRestaurant(req = request, res = response) {
    try {
       const {id}= req.params
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "No se a encontrado este restaurante",
                code: 404,
                status: false
            })
        }
        
        
        //respuesta exitosa
        return res.status(200).json({
            msg: "Restaurante encontrado",
            code: 200,
            status: true,
            restaurant
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }

}

async function signIn(req = request, res = response) {
    try {
        //requerir el body usuario y contraseña
        const { username, password } = req.body

        //evaluar si el usuario existe
        var restaurant = await restaurantModel.findOne({
            username
        })

        if (!restaurant) {
            return res.status(404).json({
                msg: "usuario o contraseña incorrectos"
            })
        }
        //si el usuario existe, evaluar si la contraseña coincide
        var passwordDecrypted = bcrypt.compareSync(password, restaurant.password)

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

async function update(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const {id} = req.params
        //requiriendo los datos del body
        const { nit, name, description, address, phone, restaurantType, username, password } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        //si no existe crea el restaurante
        await restaurantModel.updateOne(
            {_id:id},
            {
            nit,
            name,
            description,
            address,
            phone,
            restaurantType,
            username,
            password
        })
        //respuesta exitosa
        return res.status(200).json({
            msg: "Restaurante actualizado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }

}
async function deletear(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const {id} = req.params
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        //si no existe crea el restaurante
        await restaurantModel.deleteOne(
            {_id:id},
           )
        //respuesta exitosa
        return res.status(200).json({
            msg: "Restaurante borrado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }


}
async function rank(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const {id} = req.params
        //requiriendo los datos del body
        const { stars, idClient } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        //Craear calificacion con la informacion del restaurante, el cliente y la cantidad de estrellas
        const starsAdded = await StarsModel.create({
            idClient,
            idRestaurant:id,
            stars
        })
        //Agregar calificacion que hizo cliente para el restaurante
        await ClientModel.updateOne(
            {_id:idClient},
            {$push: {stars: starsAdded._id}}
        )
        //Traer todas las estrellas del restaurante en cuestion para promediar
        const RestaurantStars = await StarsModel.find({
            idRestaurant: id
        })
        
        //Promediar las estrellas para la calificacion
        const starsSum = RestaurantStars.reduce((total, restaurantStar)=> total + restaurantStar.stars, 0)
        const promStars = starsSum / RestaurantStars.length

        //Guardar promedio al restaurante
        await restaurantModel.updateOne(
            {_id: id},
            {stars: promStars}
        )
        //respuesta exitosa
        return res.status(200).json({
            msg: "Calificacion actualizada con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }

}
async function addcomment(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const {idRestaurant} = req.params
        //requiriendo los datos del body
        const { idClient, text } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        const commentCreated = await CommentModel.create(
            {text,
             idRestaurant,
             idClient   
            }
        )
        await ClientModel.updateOne(
            {_id:idClient},
            {$push: {comments: commentCreated._id}}
        )
        //si no existe crea el restaurante
        await restaurantModel.updateOne(
            {_id:idRestaurant},
            {
                $push: {comments: commentCreated._id}
        })
        //respuesta exitosa
        return res.status(200).json({
            msg: "Comentario creado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: "+error,
            code: 500,
            status: "error"
        })
    }

}

module.exports = {
    create,
    findRestaurants,
    findRestaurant,
    signIn,
    update,
    deletear,
    rank,
    addcomment
}

