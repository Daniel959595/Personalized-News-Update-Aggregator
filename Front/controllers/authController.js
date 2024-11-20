const axios = require("axios");

// Handle Login
exports.login = async (req, res) => {
  try {
    const response = await axios.post(
      "http://other-server/auth/login",
      req.body
    );

    res.cookie("token", response.data.token);
    res.json({ success: true, message: "Logged in successfully!" });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};

// Handle Signup
exports.signup = async (req, res) => {
  try {
    const response = await axios.post(
      "http://other-server/auth/signup",
      req.body
    );

    res.json({ success: true, message: "Signed up successfully!" });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};

exports.checkAuth = (req, res, next) => {
  //   const token = req.cookies.token;
  // Check if there is a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.redirect("/auth/login");
  }

  // Send token to usersManager for verification
  next();
};
