require("dotenv").config();

const axios = require("axios");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  try {
    // Create jwt token
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        // Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        Date.now() + 15 * 60 * 1000 // 15 minutes
      ),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Failed to create Token", error.message);
    res.status(error.response?.status || 400).send("Failed to create Token");
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const response = await axios.post(
      "http://localhost:3501/v1.0/invoke/users_db_accessor/method/signup",
      {
        name,
        email,
        password,
      }
    );

    console.log("Data successfully transferred to UsersDBAccessor");

    // Extract the user data from the response
    const newUser = response.data.data.user;

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error("UsersDBAccessor return with error:", error.response.data);
    res.status(error.response?.status || 400).send(error.response.data);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Please provide email and password!");

    const response = await axios.post(
      "http://localhost:3501/v1.0/invoke/users_db_accessor/method/login",
      {
        email,
        password,
      }
    );

    const user = response.data.data.user;

    console.log("User logged in successfully");

    createSendToken(user, 200, res);
  } catch (error) {
    console.error("UsersDBAccessor return with error:", error.response.data);
    res.status(error.response?.status || 400).send(error.response.data);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Check if there is a token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res
        .status(401)
        .send("You are not logged in! Please log in to get access");

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // console.log(`decoded = ${decoded}`);

    // Check if user still exists
    const currentUser = await axios.get(
      `http://localhost:3501/v1.0/invoke/users_db_accessor/method/get-user/${decoded.id}`
    );

    if (!currentUser)
      return res
        .status(401)
        .send("The user belonging to this token does no longer exist");

    // Check if user changed password after the token was issued

    // Add user to req (for next middleware)
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("UsersDBAccessor return with error:", error);
    res.status(400).send(error);
  }
};
