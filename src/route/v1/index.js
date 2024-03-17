//////////////////////////////////////////////////
const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const authenticateToken = require("../../middleware/authMiddleware");
//////////////////////////////////////////////////
router.use("/api/v1/users", authenticateToken, userRoutes);
//////////////////////////////////////////////////
module.exports = router;
