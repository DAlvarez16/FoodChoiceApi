var express = require ("express");
var Clientcontroller = require("./controller")

var router = express.Router();

router.post("/sign-in", Clientcontroller.signIn)
router.post("/sign-up", Clientcontroller.signUp)
router.get("/get-client/:id", Clientcontroller.getClient)

module.exports = router;