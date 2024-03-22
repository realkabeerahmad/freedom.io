// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const LogHandler = require("../util/loghandler");
const Logger = require("../util/logger");

const outputLog = LogHandler(
  process.env.LOG_MODE === "D" ? "authUtil" : "root",
  process.env.LOG_MODE || "D"
);
const logger = new Logger(outputLog, "S"); //process.env.LOG_MODE || "D");
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  logger.debug("Request Received for Authorization");
  if (!token) {
    return res.status(401).json({
      message: "Access Denied",
      error: "Unauthorized - Missing Token",
    });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Access Denied - Please login again",
        error: "Forbidden - Invalid Token",
      });
    }
    const sessions = await db.query(
      "SELECT * FROM USER_SESSIONS WHERE USER_ID = $1 AND TOKEN = $2 ORDER BY SESSION_ID DESC",
      [user.userId, token.split(" ")[1]]
    );
    logger.debug("Getting Sessions from the DB");
    const now = new Date();
    logger.debug(`Current Time ${now}`);
    logger.debug(`Session Time ${sessions[0]?.session_time}`);
    logger.debug(`Validation ${sessions[0]?.session_time < now}`);

    if (sessions.length > 0 && sessions[0]?.session_time < new Date()) {
      if (!sessions[0]?.is_expired)
        await db.query(
          "UPDATE USER_SESSIONS SET IS_EXPIRED = TRUE WHERE SESSION_ID = $1",
          [sessions[0]?.session_id]
        );
      return res.status(200).json({
        message: "SESSION TIME OUT PLEASE LOGIN AGAIN",
        session: sessions[0],
      });
    } else if (sessions.length > 0 && sessions[0]?.is_expired) {
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
