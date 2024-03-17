// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing Token" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden - Invalid Token" });
    }
    const sessions = await db.query(
      "SELECT * FROM USER_SESSIONS WHERE USER_ID = $1 AND TOKEN = $2 ORDER BY SESSION_ID DESC",
      [user.userId, token.split(" ")[1]]
    );

    if (sessions.length > 0 && sessions[0]?.session_time < new Date()) {
      if (!sessions[0]?.is_expired)
        await db.query(
          "UPDATE USER_SESSIONS SET IS_EXPIRED = TRUE WHERE SESSION_ID = $1",
          [sessions[0]?.session_id]
        );
      return res.status(200).json({
        message: "SESSION EXPIRED PLEASE LOGGIN AGAIN",
        session: sessions[0],
      });
    }
    req.user = user; // Attach the user to the request object for further use
    next();
  });
};

module.exports = authenticateToken;
