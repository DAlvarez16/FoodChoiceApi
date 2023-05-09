const { request, response } = require("express")
const restaurantModel = require("./model")


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
        //si no existe crea el restaurante
        await restaurantModel.create({
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

module.exports = {
    create
}