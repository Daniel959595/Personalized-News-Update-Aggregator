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
    const errorMessage = error.response?.data || "An error occurred.";
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

    createSendToken(user, 201, res);
  } catch (error) {
    const errorMessage = error.response?.data || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    // Check if there is a token

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

    // If user not exist anymore it will fail
    const response = await axios.get(
      `http://localhost:3500/v1.0/invoke/users_manager/method/users/get-user/${decoded.id}`
    );

    // Add user to req (for next middleware)
    req.user = response.data.data.user;

    // Send token to usersManager for verification
    //

    next();
  } catch (error) {
    if (error.response && error.response.status === 404)
      console.error("Error:", error.response.data);
    else console.log("Error !", error.response?.data || "an error occurred!");

    return res.redirect("/auth/login");
  }
};

exports.logout = (req, res) => {
  try {
    // Override the current cookie
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      // httpOnly: true,
    });
    res.status(200).json({ status: "success", redirectUrl: "/auth/login" });
  } catch (error) {
    const errorMessage = error.message || "An error occurred.";
    res.status(500).json({ success: false, message: errorMessage });
  }
};
