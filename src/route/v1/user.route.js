//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userController = require("../../controller/v1/user.controller");
/////////////////////////////////////////////USERS
router.post("/create/user", userController.createUserApi);
router.post("/logout", userController.logoutApi);
//////////////////////////////////////////////ROLE
router.post("/create/role", userController.createRoleApi);
router.post("/edit/role", userController.editRoleApi);
router.post("/delete/role", userController.deleteRoleApi);
//////////////////////////////////////////////////
module.exports = router;
