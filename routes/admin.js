var express = require ("express");
var admincontroller = require("../controllers/admin");

var router = express.Router();

router.post("/sign-in", admincontroller.signIn)
router.post("/create", admincontroller.create)

module.exports = router;