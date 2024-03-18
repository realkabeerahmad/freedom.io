//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userController = require("../../controller/v1/user.controller");
//////////////////////////////////////////////////
router.post("/create/user", userController.createUserApi);
router.post("/create/role", userController.createRoleApi);
router.post("/logout", userController.logoutApi);
//////////////////////////////////////////////////
module.exports = router;
