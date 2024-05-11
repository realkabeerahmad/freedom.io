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