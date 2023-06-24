const { request, response } = require("express")
const restaurantModel = require("./model")
const CommentModel = require("../comments/model")
const ClientModel = require("../cliente/model")
const StarsModel = require("../stars/model")
const bcrypt = require("bcryptjs")
const { Types } = require("mongoose")
const path = require("path")
const fs = require("fs")

async function create(req = request, res = response) {
    try {
        //requiriendo los datos del body
        const { nit, name, description, address, phone, restaurantType, username, password } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findOne({ nit })
        //Si existe respuesta de negacion
        if (restaurant) {
            return res.status(200).json({
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
        return res.status(201).json({
            msg: "Restaurante creado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }

}

async function findRestaurants(req = request, res = response) {
    try {

        //validar que el restaurante no exista en la base de datos
        const restaurants = await restaurantModel.aggregate(
            [
                {
                    $lookup: {
                        from: 'comments',
                        localField: "comments",
                        foreignField: "_id",
                        as: 'comments',
                    }
                }
            ]
        )
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
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }

}

async function findRestaurant(req = request, res = response) {
    try {
        const { id } = req.params
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.aggregate(
            [
                {
                    $match: { _id: new Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: "comments",
                        foreignField: "_id",
                        as: 'comments',
                    }
                }
            ]
        )
        //Si existe respuesta de negacion
        if (restaurant.length == 0) {
            return res.status(409).json({
                msg: "No existe el restaurante registrado",
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
            msg: "Error interno del servidor: " + error,
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
            return res.status(200).json({
                msg: "usuario o contraseña incorrectos",
                code: 404
            })
        }
        //si el usuario existe, evaluar si la contraseña coincide
        var passwordDecrypted = bcrypt.compareSync(password, restaurant.password)

        if (!passwordDecrypted) {
            return res.status(200).json({
                msg: "usuario o contraseña incorrectos",
                code: 401
            })
        }
        //Si todo esta correcto dejar pasar al admin
        return res.status(200).json({
            msg: "Bienvenido",
            code: 200,
            restaurant
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error interno del servidor: " + error,
            code: 500
        })
    }

}

async function update(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const { id } = req.params
        //requiriendo los datos del body
        const { nit, name, description, address, phone, restaurantType, username, password } = req.body
        
        //encryptar la nueva contraseña
        var salt = bcrypt.genSaltSync(6)
        var hash = bcrypt.hashSync(password, salt)

        //actualizar la informacion del restaurante
        await restaurantModel.updateOne(
            { _id: id },
            {
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
            msg: "Restaurante actualizado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }

}
async function deletear(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const { id } = req.params
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
            { _id: id },
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
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }


}
async function rank(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const { id } = req.params
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
            idRestaurant: id,
            stars
        })
        //Agregar calificacion que hizo cliente para el restaurante
        await ClientModel.updateOne(
            { _id: idClient },
            { $push: { stars: starsAdded._id } }
        )
        //Traer todas las estrellas del restaurante en cuestion para promediar
        const RestaurantStars = await StarsModel.find({
            idRestaurant: id
        })

        //Promediar las estrellas para la calificacion
        const starsSum = RestaurantStars.reduce((total, restaurantStar) => total + restaurantStar.stars, 0)
        const promStars = starsSum / RestaurantStars.length

        //Guardar promedio al restaurante
        await restaurantModel.updateOne(
            { _id: id },
            { stars: promStars }
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
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }

}
async function addcomment(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const { idRestaurant } = req.params
        //requiriendo los datos del body
        const { idClient, text } = req.body
        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(idRestaurant)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(409).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        const commentCreated = await CommentModel.create(
            {
                text,
                idRestaurant,
                idClient
            }
        )
        await ClientModel.updateOne(
            { _id: idClient },
            { $push: { comments: commentCreated._id } }
        )
        //si no existe crea el restaurante
        await restaurantModel.updateOne(
            { _id: idRestaurant },
            {
                $push: { comments: commentCreated._id }
            })
        //respuesta exitosa
        return res.status(201).json({
            msg: "Comentario creado con exito",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }


}
async function adminRecomendation(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const { id } = req.params

        //validar que el restaurante no exista en la base de datos
        const restaurant = await restaurantModel.findById(id)
        //Si existe respuesta de negacion
        if (!restaurant) {
            return res.status(404).json({
                msg: "Este restaurante no existe",
                code: 404,
                status: false
            })
        }
        //si no existe crea el restaurante
        await restaurantModel.updateOne(
            { _id: id },
            {
                adminRecomendation: !restaurant.adminRecomendation
            })
        //respuesta exitosa
        return res.status(201).json({
            msg: "Recomendación actualizada",
            code: 201,
            status: true
        })
    } catch (error) {
        //respuesta error del servidor
        return res.status(500).json({
            msg: "Error interno del servidor: " + error,
            code: 500,
            status: "error"
        })
    }

}

async function addImage(req = request, res = response) {
    const file = req.file.filename
    try {
        const { id } = req.params        

        //verificar si el restaurante ya tenia imagen antes para borrarla
        const restaurant = await restaurantModel.findById(id)

        //si el restaurante tenia una imagen antes, eliminamos esa imagen para que ingrese la nueva
        if (restaurant.image != 'no-image') {
            const filePath = path.join(__dirname, '../../uploads/' + restaurant.image)
            
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        msg: "An error ocurred: " + err,
                        code: 500
                    })
                }
            })
        }

        //actualizamos el nombre de la imagen en la bd
        await restaurantModel.updateOne(
            { _id: new Types.ObjectId(id) },
            { image: file }
        )

        return res.status(201).json({
            msg: 'Se ha actualizado la imagen del restaurante',
            code: 201
        })

    } catch (error) {
        //si ocurre un error, la imagen no debe guardarse
        const filePath = path.join(__dirname, '../../uploads/' + file)
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({
                    msg: "An error ocurred: " + err,
                    code: 500
                })
            }
        })
        return res.status(500).json({
            code: 500,
            msg: 'Error interno del sarvidor --> ' + error
        })
    }
}

async function getImage(req = request, res = response){
    try {
        //pedimos la id del restaurante
        const {id} = req.params
        //buscamos el restaurante para obtener el nombre de la iamgen
        const restaurant = await restaurantModel.findById(id)
        //al obtener el nombre de la imagen que viene de la bd podemos ubicarla en la carpeta uploads
        const filePath = path.join(__dirname, '../../uploads/' + restaurant.image)
        //retornamos la imagen una vez ubicada en la carpeta uploads
        return res.status(200).sendFile(filePath)
    } catch (error) {
        return res.status(500).json({
            code: 500,
            msg: 'Error interno del sarvidor --> ' + error
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
    addcomment,
    adminRecomendation,
    addImage,
    getImage
}

