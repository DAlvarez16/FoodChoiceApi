var express = require ("express");
var commentcontroller = require("./controller");

var router = express.Router();
router.put("/update/:id", commentcontroller.update)
router.delete("/delete/:id", commentcontroller.deletear)

module.exports = router;