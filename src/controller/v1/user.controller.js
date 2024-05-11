const db = require("../../config/db");
const LogHandler = require("../../util/loghandler");
const Logger = require("../../util/logger");
const bcrypt = require("bcrypt");
const generateToken = require("../../util/authUtils");
const Users = require("../../classes/user");

const outputLog = LogHandler(
  process.env.LOG_MODE === "D" ? "dev" : "root",
  process.env.LOG_MODE || "D"
);
const logger = new Logger(outputLog, process.env.LOG_MODE || "D");
// Register route for Creating a new user

async function createRoleApi(req, res) {
  try {
    const { role_id, name, description, precidence, ordr } = req.body;

    // Start a transaction
    await db.tx(async (t) => {
      // Check if role with given id already exists
      const existingRole = await t.oneOrNone(
        "SELECT * FROM roles WHERE role_id = $1",
        [role_id.toUpperCase()]
      );

      if (existingRole) {
        logger.info(`ROLE: ${existingRole.role_id} already exists`);
        return res.status(400).json({
          status: "400",
          message: `ROLE: ${existingRole.role_id.toUpperCase()} already exists`,
        });
      }

      logger.debug(
        `Going to create a new role with id -> ${role_id.toUpperCase()}`
      );

      // Insert new role into the database
      const newRole = await t.one(
        "INSERT INTO roles (role_id, name, description, precidence, ordr) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          role_id.toUpperCase(),
          name.toUpperCase(),
          description,
          precidence,
          ordr,
        ]
      );
      logger.debug(`Saved new role with id -> ${newRole.role_id}`);

      res
        .status(201)
        .json({ status: "201", message: "New Role Created", data: newRole });
    });
  } catch (error) {
    logger.exception(error);
    res
      .status(500)
      .json({ status: "500", message: "Unable to create role", data: null });
  }
}

async function createUserApi(req, res) {
  try {
    const time = new Date();
    const user = new Users(
      req.body.user_id,
      req.body.email,
      undefined,
      req.body.firstname,
      req.body.lastname,
      req.body.gender,
      req.body.dob,
      req.body.phone,
      req.body.mobile,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.role_id,
      time,
      undefined
    );
    logger.info(`User OBJ: ${JSON.stringify(user)}`);
    logger.info(
      `Role id of the Authorized user -> ${JSON.stringify(req.user.roleID)}`
    );
    const AuthRole = await getRole(req.user.roleID, res);
    const ReqRole = await getRole(user.getRoleId(), res);
    logger.info(`Data Received in Request -> ${JSON.stringify(user)}`);
    logger.info("GOING to check user availability in Database");
    logger.info(`${JSON.stringify(AuthRole)} \n ${JSON.stringify(ReqRole)}`);

    if (AuthRole && ReqRole && AuthRole.precidence >= ReqRole.precidence) {
      // Check if user with the same user_id already exists
      const existingUserQuery = await db.query(
        "SELECT * FROM users WHERE user_id = $1",
        [user.getUserId()]
      );
      logger.debug(JSON.stringify(existingUserQuery));
      if (existingUserQuery?.length > 0) {
        logger.info(`User with user_id: ${user.getUserId()} already exists`);
        return res.status(400).json({
          status: "400",
          message: `User with user_id: ${user.getUserId()} already exists`,
        });
      }

      logger.info(
        `Going to call generatePasswordAPI to generate Password for the ${user.getUserId()}`
      );
      const generatedPassword = generatePassword(); // Assuming generatePassword returns an object with `password` property
      logger.info(`Generated Password Response: ${generatedPassword.password}`);

      // Generate salt and hash password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(generatedPassword.password, salt);
      logger.info(`Hashed Password: ${hashedPassword}`);
      // Insert new user into the database
      const newUserQuery = await db.query(
        "INSERT INTO users (user_id, email, firstname, lastname, gender, dob, phone, mobile, address, role_id, enc_password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          user_id,
          email,
          firstname,
          lastname,
          gender,
          dob,
          phone,
          mobile,
          address,
          role_id,
          hashedPassword,
        ]
      );

      logger.info("User saved to database");
      res.status(201).json(newUserQuery);
    } else {
      logger.info(
        `${
          req.user.roleID
        } is not authorized to create user with role: ${user.getRoleId()}`
      );
      res.status(401).json({
        message: `${
          req.user.roleID
        } is not authorized to create user with role: ${user.getRoleId()}`,
      });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Edit Role API
async function editRoleApi(req, res) {
  try {
    const { role_id, name, description, precidence, ordr } = req.body;

    // Get the role from the database
    const role = await getRole(role_id);

    // Check if the role exists
    if (!role || role.length === 0) {
      return res.status(404).json({
        status: "404",
        message: `Role with ID ${role_id.toUpperCase()} not found`,
        data: null,
      });
    }

    // Prepare updated role data
    const updatedRoleData = {
      name: name || role[0].name,
      description: description || role[0].description,
      precidence: precidence || role[0].precidence,
      ordr: ordr || role[0].ordr,
      updated_at: new Date(),
    };

    // Update role in the database
    const updatedRole = await db.oneOrNone(
      "UPDATE roles SET name = $1, description = $2, precidence = $3, ordr = $4 WHERE role_id = $5 RETURNING *",
      [
        updatedRoleData.name.toUpperCase(),
        updatedRoleData.description,
        updatedRoleData.precidence,
        updatedRoleData.ordr,
        role_id.toUpperCase(),
      ]
    );

    if (updatedRole) {
      return res.status(200).json({
        status: "200",
        message: "Role updated successfully",
        data: updatedRole,
      });
    } else {
      return res.status(500).json({
        status: "500",
        message: "Unable to update role",
        data: null,
      });
    }
  } catch (error) {
    logger.exception(error);
    return res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      data: null,
    });
  }
}

// Delete Role API
async function deleteRoleApi(req, res) {
  try {
    const { role_id } = req.body;

    // Delete role from the database
    const deletedRole = await db.oneOrNone(
      "DELETE FROM roles WHERE role_id = $1 RETURNING *",
      [role_id.toUpperCase()]
    );

    if (deletedRole) {
      return res.status(200).json({
        status: "200",
        message: "Role deleted successfully",
        data: deletedRole,
      });
    } else {
      return res.status(404).json({
        status: "404",
        message: `Role with ID ${role_id.toUpperCase()} not found`,
        data: null,
      });
    }
  } catch (error) {
    logger.exception(error);
    return res.status(500).json({
      status: "500",
      message: "Unable to delete role",
      data: null,
    });
  }
}

async function getRole(roleID) {
  const role = await db.query("SELECT * FROM ROLES WHERE ROLE_ID = $1", [
    roleID,
  ]);

  if (role?.length < 1) {
    return null;
  } else {
    return role[0]; // Return the first role object
  }
}

function generatePassword(length = 10) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return {
    res: "00",
    desc: "Password Generated Successfully",
    password: password,
  };
}

async function loginApi(req, res) {
  const { user_id, password } = req.body;
  logger.info("Going to execute the login API");
  logger.debug(`Data Received in request -> , ${user_id}, ${password}`);
  try {
    logger.info("Retrieve the latest session for the user");
    const sessions = await db.query(
      "SELECT * FROM user_sessions WHERE user_id = $1 ORDER BY session_id DESC LIMIT 1",
      [user_id]
    );

    if (
      sessions.length > 0 &&
      sessions[0]?.session_time > new Date() &&
      !sessions[0]?.is_expired
    ) {
      logger.info("User already logged in");
      return res
        .status(200)
        .json({ message: "User already logged in", session: sessions[0] });
    }

    logger.debug("No user session found going to Authenticate user");
    const session_id = sessions[0]?.session_id;

    // Find user by user_id
    const user = await db.query(
      "SELECT user_id, role_id, enc_password FROM users WHERE user_id = $1",
      [user_id]
    );
    logger.debug(`User Found in DB -> ${JSON.stringify(user)}`);
    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid user_id" });
    }

    const userDetails = user[0];
    logger.debug(`User DETAILS -> ${JSON.stringify(userDetails)}`);

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      password,
      userDetails.enc_password
    );
    logger.debug(`Password Matched -> ${JSON.stringify(passwordMatch)}`);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate and send a JWT token
    const token = generateToken(userDetails);

    // Expire the previous session if it exists
    if (session_id !== undefined) {
      await db.query(
        "UPDATE user_sessions SET is_expired = TRUE WHERE session_id = $1",
        [session_id]
      );
    }

    // Create a new session
    const newSession = await db.query(
      "INSERT INTO user_sessions (user_id, token) VALUES ($1, $2) RETURNING *",
      [user_id, token]
    );
    res.status(200).json({
      message: "User is authorized to access the services",
      session: newSession[0],
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function logoutApi(req, res) {
  try {
    const { userId } = req.user; // Destructure userId directly from req.user
    logger.debug(`USER ID RECEIVED IN REQ -> ${userId}`);

    const token = req.header("Authorization");
    logger.debug(`TOKEN RECEIVED IN REQ -> ${token.split(" ")[1]}`);

    const sessions = await db.query(
      "SELECT * FROM USER_SESSIONS WHERE USER_ID = $1 AND TOKEN = $2 ORDER BY SESSION_ID DESC",
      [userId, token.split(" ")[1]]
    );
    logger.debug("Getting Sessions from the DB");
    logger.debug(`SESSIONS FROM DB -> ${JSON.stringify(sessions)}`); // Convert sessions array to string for logging

    if (!sessions[0]?.is_expired) {
      logger.debug(`SECOND VALIDATION PASSED`);
      await db.query(
        "UPDATE USER_SESSIONS SET IS_EXPIRED = TRUE WHERE SESSION_ID = $1",
        [sessions[0]?.session_id]
      );
      logger.debug(`SESSION UPDATED SENDING RESPONSE`);
      return res.status(200).json({
        message: "SESSION TIME OUT PLEASE LOGIN AGAIN",
        session: sessions[0],
      });
    } else {
      return res.status(200).json({ message: "No active session found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createRoleApi,
  editRoleApi,
  deleteRoleApi,
  createUserApi,
  loginApi,
  logoutApi,
};
