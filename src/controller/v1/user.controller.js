const db = require("../../config/db");
const LogHandler = require("../../util/loghandler");
const Logger = require("../../util/logger");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../../model/v1/user");
dotenv.config();

const outputLog = LogHandler("dev", process.env.LOG_MODE || "D");
const logger = new Logger(outputLog, process.env.LOG_MODE || "D");
// Register route for Creating a new user

async function createRole(req, res) {
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

async function createUser(req, res) {
  try {
    const userData = ({
      username,
      email,
      firstname,
      lastname,
      gender,
      dob,
      phone,
      mobile,
      address,
      role,
    } = req.body);
    logger.info(`Data Received in Request -> ${JSON.stringify(userData)}`);
    logger.info(`GOING to check user availability in Database`);
    const existingUser = await User.User.findOne({
      username: userData.username,
    });

    if (existingUser) {
      logger.info(`User with username: ${userData.username} already exists`);
      return res.status(400).json({
        status: "400",
        message: `User with username: ${userData.username} already exists`,
      });
    }

    logger.debug(
      `Going to call generatePasswordAPI to generate Password for the ${userData.username}`
    );
    const generatedPassword = generatePassword(); // Assuming generatePassword returns an object with `password` property
    logger.debug(
      `Generated Password Reponse: ${
        (generatedPassword.res, generatedPassword.desc)
      }`
    );

    // Generating Salt using genSaltSync function with 10 rounds
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(generatedPassword.password, salt);
    logger.debug(`Hashed Password: ${hashedPassword}`);

    const newUser = new User.User({
      ...userData,
      enc_password: hashedPassword,
    });
    logger.debug(`Created User Object: ${newUser}`);

    await newUser.save();
    logger.debug(`User saved to database`);

    res.status(201).json(newUser);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err });
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

async function getUsers(req, res) {
  try {
    const users = await User.User.find();
    logger.info(`Returning All Users -> ${JSON.stringify(users)}`);
    res.status(200).json({ message: "Returning All Users", data: users });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: err });
  }
}

module.exports = {
  createUser,
  createRole,
  getUsers,
};

//   // Generating Salt using genSaltSync function with 10 rounds
//   const salt = bcrypt.genSaltSync(10);
//   // Check if email already exist in DB
//   try {
//     User.findOne({ username: username }, (err, user) => {
//       if (user) {
//         res.json({ status: "failed", message: "User Already Exist" });
//       } else if (err) {
//         res.json({ status: "failed", message: "Server Error" });
//       } else {
//         // Creating a user object to save in database
//         const user = new User({
//           name: firstName + " " + lastName,
//           email,
//           password,
//           Image: "https://i.ibb.co/Lk9vMV2/newUser.png",
//         });
//         // Hashing users password
//         bcrypt.hash(user.password, salt, null, async (err, hash) => {
//           if (err) {
//             throw Error(err.message);
//           }
//           // Storing HASH Password in user object
//           user.password = hash;
//           // Storing user in our Database
//           await user
//             .save()
//             .then((result) => {
//               SendOtpVerificationEmail(result, res);
//             })
//             .catch(() => {
//               res.json({ status: "failed", message: "Unable to Registered" });
//             });
//         });
//       }
//     });
//   } catch (error) {
//     res.json({ status: "failed", message: error.message });
//   }
// };

// // Show User route
// router.post("/showUser", (req, res) => {
//   const { _id } = req.body;
//   try {
//     User.findById({ _id }, (err, user) => {
//       if (user) {
//         res.status(200).send({
//           status: "success",
//           message: "User updated successfully",
//           user: user,
//         });
//       } else {
//         res.status(200).send({
//           status: "failed",
//           message: "User not updated",
//         });
//       }
//     });
//   } catch (error) {
//     res.json({ status: "failed", error: error.message });
//   }
// });

// // Show All Users route
// router.get("/showAllUser", (req, res) => {
//   try {
//     User.find({}, (err, users) => {
//       if (users) {
//         res.status(200).send({
//           status: "success",
//           message: "All Users sent successfully",
//           users: users,
//         });
//       } else {
//         res.status(200).send({
//           status: "failed",
//           message: "User not updated",
//         });
//       }
//     });
//   } catch (error) {
//     res.json({ status: "failed", error: error.message });
//   }
// });

// // Login route to allow registered users to login
// router.post("/login", (req, res) => {
//   // Getting all required data from request body
//   const { email, password } = req.body;
//   // Checking if User exist
//   try {
//     User.findOne({ email: email }, (err, user) => {
//       if (user) {
//         if (user.verified) {
//           // Decrypting and comparing Password
//           const validPassword = bcrypt.compareSync(password, user.password);
//           if (validPassword) {
//             res.send({
//               status: "success",
//               message: "Valid Password",
//               user: user,
//             });
//           } else {
//             res.send({
//               status: "failed",
//               message: "Invalid Password",
//               user: user,
//             });
//           }
//         } else {
//           res.send({
//             status: "pending",
//             message: "Please Verify Your Email",
//             user: user,
//           });
//         }
//       } else {
//         res.send({ status: "failed", message: "User do not Exist" });
//       }
//     });
//   } catch (error) {
//     res.json({ status: "failed", error: error.message });
//   }
// });

// // Verify OTP route
// router.post("/verifyOTP", async (req, res) => {
//   try {
//     // Get data from Request body
//     const { userID, otp } = req.body;
//     // Check OTP Details
//     if (!userID || !otp) {
//       throw Error("Empty otp Details are not allowed");
//     } else {
//       // Find OTP
//       const userVerificationRecords = await userOtpVerification.find({
//         userID,
//       });
//       if (userVerificationRecords.length <= 0) {
//         res.send({
//           status: "failed",
//           message:
//             "Account record doesn't exist or has been verified already. Please Signup or Login.",
//         });
//       } else {
//         const { expiredAt } = userVerificationRecords[0];
//         const hashedOTP = userVerificationRecords[0].otp;
//         // Check if Expired
//         if (expiredAt < Date.now()) {
//           await userOtpVerification.deleteMany({ userID });
//           res.send({
//             status: "failed",
//             message: "Code has Expired. Please request again.",
//           });
//         } else {
//           // Check OTP
//           const validotp = bcrypt.compareSync(otp, hashedOTP);
//           if (!validotp) {
//             res.send({
//               status: "failed",
//               message: "Invalid OTP please check your Email.",
//             });
//           } else {
//             // Update User Status
//             await User.findByIdAndUpdate(
//               { _id: userID },
//               { verified: true }
//             ).then(() => {
//               userOtpVerification.deleteMany({ userID }).then(() => {
//                 res.json({
//                   status: "success",
//                   message: "User Email Verified successfully.",
//                 });
//               });
//             });
//           }
//         }
//       }
//     }
//   } catch (error) {
//     res.json({
//       status: "failed",
//       message: error.message,
//     });
//   }
// });
// // Add User Image
// router.post("/updateProfileImage", (req, res) => {
//   const { userId, url } = req.body;
//   try {
//     User.findByIdAndUpdate({ _id: userId }, { Image: url })
//       .then(() => {
//         res.status(200).json({
//           status: "success",
//           message: "Image Added successfully",
//           data: userId,
//         });
//       })
//       .catch((err) => {
//         throw Error("Unable to update Image" + err.message);
//       });
//   } catch (error) {
//     res.json({
//       status: "failed",
//       error: error.message,
//     });
//   }
// });

// // Re-send OTP route
// router.post("/reSendOtpVerificatioCode", async (req, res) => {
//   try {
//     // Get Data from Request Body
//     let { userID, email } = req.body;
//     //Check if Data is Correct
//     if (!userID || !email) {
//       throw Error("Empty user Details are not allowed");
//     } else {
//       // Delete old OTP Generated
//       await userOtpVerification.deleteMany({ userID });
//       // Call Send OTP Function
//       SendOtpVerificationEmail({ _id: userID, email }, res);
//     }
//   } catch (error) {
//     res.send({
//       status: "failed",
//       message: error.message,
//     });
//   }
// });

// // Send OTP Function
// const SendOtpVerificationEmail = async ({ _id, email }, res) => {
//   try {
//     // Generated OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);
//     // Mail Options
//     const mailOptions = {
//       from: process.env.USER,
//       to: email,
//       subject: "Verify your Email",
//       text: "OTP Verification Email",
//       html: `
//       <h2>Hello and Welcome to <span style="color:#e92e4a;">pethub.com</span></h2>
//       <p>Your OTP verification code is <span style="color:#e92e4a; font-size:20px;">${otp}</span></p>.
//       <p>Enter this code in our website or mobile app to activate your account.</p>
//       <br/>
//       <p>If you have any questions, send us an email <span style="color:blue;">support.pethub@zohomail.com</span>.</p>
//       <br/>
//       <p>We’re glad you’re here!</p>
//       <p style="color:#e92e4a;">The PETHUB team</p>`,
//     };

//     //hash the OTP
//     const saltRounds = 10;

//     // generating salt
//     const salt = bcrypt.genSaltSync(saltRounds);

//     // getting Hashed OTP
//     const hashedOTP = bcrypt.hashSync(otp, salt);

//     //OTP Verification DB object
//     const newOtpVerfication = new userOtpVerification({
//       userID: _id,
//       otp: hashedOTP,
//       createdAt: Date.now(),
//       expiredAt: Date.now() + 3600000,
//     });
//     await newOtpVerfication.save();
//     transporter.sendMail(mailOptions, (err, info) => {
//       // console.log(err);
//       if (err) {
//         User.findByIdAndDelete({ _id: _id })
//           .then(() => {
//             return res.send({
//               status: "failed",
//               message: "Not able to send OTP" + err.message,
//             });
//           })
//           .catch((err) => {
//             return res.send({
//               status: "failed",
//               message: "Server Error" + err.message,
//             });
//           });
//       } else {
//         return res.send({
//           status: "pending",
//           message: "Verification OTP email sent.",
//           data: {
//             userId: _id,
//             email,
//           },
//         });
//       }
//     });
//   } catch (error) {
//     res.json({
//       status: "failed",
//       message: "error message",
//     });
//   }
// };

// // Expoting Routes
// module.exports = router;

// const Register = (req, res) => {
//   const {
//     first_name,
//     middle_name,
//     last_name,
//     email,
//     mobile,
//     phone,
//     gender,
//     nid,
//     address1,
//     address2,
//     city,
//     state,
//     country,
//     password,
//   } = req.body;
// };
