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
    return res
      .status(error.response?.status || 400)
      .send("Failed to create Token");
  }
};

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios.post(
      "http://localhost:3500/v1.0/invoke/users_manager/method/users/login",
      req.body
    );

    const user = response.data.data.user;

    createSendToken(user, 200, res);

    console.log("User logged in successfully");
  } catch (error) {
    const errorMessage = error.response.data || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};

exports.signup = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:3500/v1.0/invoke/users_manager/method/users/signup",
      req.body
    );

    console.log("User signin successfully");

    const user = response.data.data.user;
    // res.cookie("token", response.data.token);
    // res.status(200).json({
    //   status: "success",
    //   // token,
    //   data: {
    //     user,
    //   },
    // });
    createSendToken(user, 201, res);
  } catch (error) {
    const errorMessage = error.response.data || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};

exports.checkAuth = async (req, res, next) => {
  //   const token = req.cookies.token;
  // Check if there is a token
  try {
    console.log("Checking for token!");

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.redirect("/auth/login");
    }
    console.log("Token found!");

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded.id);

    const response = await axios.get(
      `http://localhost:3500/v1.0/invoke/users_manager/method/users/get-user/${decoded.id}`
    );

    // Add user to req (for next middleware)
    req.user = response.data.data.user;
    // console.log(req.user);

    // Send token to usersManager for verification
    next();
  } catch (error) {
    console.log(error);
    //
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
      `http://localhost:3505/v1.0/invoke/users_manager/method/get-user/${decoded.id}`
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
    console.error("UsersManagers return with error:", error);
    res.status(400).send(error);
  }
};
