const {request, response} = require("express")
const commentModel = require("./model")
const restaurantModel = require("../restaurant/model")
const {Types} = require("mongoose")

async function update(req = request, res = response) {
    try {
        //requiriendo id de mongo
        const {id} = req.params
        //requiriendo los datos del body
        const { text} = req.body
        //validar que el restaurante no exista en la base de datos
        const comment = await commentModel.findById(id)
        //Si existe respuesta de negacion
        if (!comment) {
            return res.status(404).json({
                msg: "Este comentario no existe",
                code: 404,
                status: false
            })
        }
        //si no existe crea el restaurante
        await commentModel.updateOne(
            {_id:id},
            {
            text
        })
        //respuesta exitosa
        return res.status(200).json({
            msg: "Comentario actualizado con exito",
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
        //validar que el comentario no exista en la base de datos
        const comment = await commentModel.findById(id)
        //Si existe respuesta de negacion
        if (!comment) {
            return res.status(409).json({
                msg: "Este comentario no existe",
                code: 404,
                status: false
            })
        }
        //si no existe borrar el comentario pd: algunos comentarios estan mal
        await commentModel.deleteOne(
            {_id:id},
        )
        //borra la id del comentario del modelo de restaurante
        await restaurantModel.updateOne(
            {_id: comment.idRestaurant},
            {$pull:{comments:comment._id}}
        )
        //respuesta exitosa
        return res.status(200).json({
            msg: "Comentario borrado con exito",
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

module.exports={
    update,
    deletear
}