var express = require ("express");
var Clientcontroller = require("./controller")

var router = express.Router();

router.post("/sign-in", Clientcontroller.signIn)
router.post("/sign-up", Clientcontroller.signUp)

module.exports = router;