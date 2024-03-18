// src/utils/authUtils.js
const jwt = require("jsonwebtoken");

function generateToken(user) {
  // Assuming user has an id and other relevant data
  console.log(user);
  const payload = {
    userId: user.user_id,
    roleID: user.role_id,
    // Add other relevant data to the payload
  };

  const options = {
    expiresIn: "8h", // Set the expiration time for the token (e.g., 1 hour)
  };

  const secret = process.env.JWT_SECRET; // Retrieve your secret from environment variables

  const token = jwt.sign(payload, secret, options);
  return token;
}

module.exports = generateToken;
