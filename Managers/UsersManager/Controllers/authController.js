require("dotenv").config();

const axios = require("axios");
const jwt = require("jsonwebtoken");
// const { promisify } = require("util");

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
// const createSendToken = (user, statusCode, res) => {
//   // Create jwt token

//   // Remove password from output
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// };

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
