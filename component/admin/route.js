var express = require ("express");
var admincontroller = require("./controller")

var router = express.Router();

router.post("/sign-in", admincontroller.signIn)
router.post("/create", admincontroller.create)
router.get("/get-admin/:id", admincontroller.getAdmin)

module.exports = router;