//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const authenticateToken = require("../../middleware/authMiddleware");
const { loginApi } = require("../../controller/v1/user.controller");
//////////////////////////////////////////////////
if (process.env.API_MODE === "D") {
  router.use("/api/v1/dev/users", userRoutes);
} else if (process.env.API_MODE === "P") {
  router.use("/api/v1/users", authenticateToken, userRoutes);
}
router.use("/api/v1/login", loginApi);
//////////////////////////////////////////////////
module.exports = router;
