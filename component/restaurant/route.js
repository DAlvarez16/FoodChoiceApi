var express = require ("express");
var restaurantcontroller = require("./controller");
const path = require("path")
const crypto = require("crypto")
const multer = require("multer")

var router = express.Router();

//middleware para cargar archivos en el servidor (Fotos de los restaurantes)
const storage = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(18).toString('hex')
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({storage})

//router.post("/sign-in", restautarantcontroller.signIn)
router.post("/create", restaurantcontroller.create)
router.get("/get-restaurants", restaurantcontroller.findRestaurants)
router.get("/get-restaurant/:id", restaurantcontroller.findRestaurant)
router.post("/sign-in", restaurantcontroller.signIn)
router.put("/update/:id", restaurantcontroller.update)
router.delete("/delete/:id", restaurantcontroller.deletear)
router.put("/rank/:id", restaurantcontroller.rank)
router.post("/add-comment/:idRestaurant", restaurantcontroller.addcomment)
router.put("/admin-recomendation/:id", restaurantcontroller.adminRecomendation)
router.put("/add-image/:id", upload.single('file0'),restaurantcontroller.addImage)
router.get("/get-image/:id", restaurantcontroller.getImage)
module.exports = router;