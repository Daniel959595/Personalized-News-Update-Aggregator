const User = require("../models/userModel.js");

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    console.log("User saved to MongoDB");

    // Remove password from the output (for security reasons)
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send(`Failed to save user: ${error.message}`);
  }
};
