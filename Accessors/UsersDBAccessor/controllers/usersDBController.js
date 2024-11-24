const User = require("../models/userModel.js");

const createSendToken = (user, statusCode, res) => {
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
};

const handleValidationErrorDB = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  res.status(400).send(message);
};

exports.signup = async (req, res) => {
  try {
    console.log("In users db controller1");

    // Check if the user already exists
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser) {
      console.log("User already exists!");
      return res.status(400).send("User already exists!");
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    console.log("User saved to MongoDB");

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error("Error saving user:", error.message);

    // Mongoose validation error
    if (error.name === "ValidationError") handleValidationErrorDB(error, res);
    else res.status(400).send("Error saving user");
  }
};

exports.login = async (req, res) => {
  try {
    console.log("In users db controller1");

    const { email, password } = req.body;

    console.log(`${email} - ${password}`);

    if (!email || !password)
      return res.status(400).send("Please provide email and password!");

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(401).send("Incorrect email or password");

    console.log("User logged in successfully");

    createSendToken(user, 200, res);
    // Create send token to client
  } catch (error) {
    res.status(400).send("Login failed!");
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`INgetUserById id: ${id}`);

    const user = await User.findById(id);

    if (!user) return res.status(404).send("User not found");

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    res.status(500).send("Error retrieving user");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log("In getAllUsers");

    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).send("Error retrieving users");
  }
};

exports.setUserPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, text } = req.body;

    console.log(`In setUserPreference for user id: ${id}`);

    const user = await User.findById(id);

    if (!user) return res.status(404).send("User not found");

    // Update preferences
    user.category = category;
    user.q = text;
    await user.save();

    console.log("User preference updated successfully");

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Error setting user preference:", error.message);
    res.status(500).send("Error setting user preference");
  }
};
