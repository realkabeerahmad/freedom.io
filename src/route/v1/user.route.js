//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/v1/userController");
//////////////////////////////////////////////////
router.post("/create/user", userController.createUser);
router.post("/create/role", userController.createRole);
router.get("/get/all", userController.getUsers);
//////////////////////////////////////////////////
module.exports = router;
