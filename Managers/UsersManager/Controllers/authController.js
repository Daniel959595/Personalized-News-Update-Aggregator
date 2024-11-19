const axios = require("axios");

// const User = require("../models/userModel.js");

const createSendToken = (user, statusCode, res) => {
  // Create jwt token

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

// const handleValidationErrorDB = (err, res) => {
//   const errors = Object.values(err.errors).map((el) => el.message);

//   const message = `Invalid input data. ${errors.join(". ")}`;
//   res.status(400).send(message);
// };

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the user already exists
    // const oldUser = await User.findOne({ email: req.body.email });
    // if (oldUser) {
    //   console.log("User already exists!");
    //   return res.status(400).send("Email already exists!");
    // }

    // const newUser = await User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // });

    // console.log("User saved to MongoDB");

    const response = await axios.post(
      "http://localhost:3501/v1.0/invoke/users_db_accessor/method/save-user",
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
      res.status(400).send("Please provide email and password!");

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password)))
      res.status(401).send("Incorrect email or password");

    console.log("User log in successfully");

    createSendToken(user, 200, res);
    // Create send token to client
  } catch (error) {}
};
