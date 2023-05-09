var express = require ("express");
var admincontroller = require("./controller")

var router = express.Router();

router.post("/sign-in", admincontroller.signIn)
router.post("/create", admincontroller.create)

module.exports = router;