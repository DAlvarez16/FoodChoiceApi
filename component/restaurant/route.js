var express = require ("express");
var restaurantcontroller = require("./controller");

var router = express.Router();

//router.post("/sign-in", restautarantcontroller.signIn)
router.post("/create", restaurantcontroller.create)
router.get("/get-restaurants", restaurantcontroller.findRestaurants)
router.get("/get-restaurant/:id", restaurantcontroller.findRestaurant)
router.post("/sign-in", restaurantcontroller.signIn)
router.put("/update/:id", restaurantcontroller.update)
router.delete("/delete/:id", restaurantcontroller.deletear)
router.put("/rank/:id", restaurantcontroller.rank)
router.post("/add-comment/:idRestaurant", restaurantcontroller.addcomment)

module.exports = router;