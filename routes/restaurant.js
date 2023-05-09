var express = require ("express");
var restaurantcontroller = require("../controllers/restaurant");

var router = express.Router();

//router.post("/sign-in", restautarantcontroller.signIn)
router.post("/create", restaurantcontroller.create)

module.exports = router;