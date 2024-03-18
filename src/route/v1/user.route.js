//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userController = require("../../controller/v1/user.controller");
//////////////////////////////////////////////////
router.post("/create/user", userController.createUser);
router.post("/create/role", userController.createRole);
router.post("/logout", userController.logout);
//////////////////////////////////////////////////
module.exports = router;
