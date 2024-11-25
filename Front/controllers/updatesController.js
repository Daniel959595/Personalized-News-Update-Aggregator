const axios = require("axios");

exports.getUpdates = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if the user already has preferences

    // EXport to a reusable function !!!
    const response1 = await axios.get(
      `http://localhost:3500/v1.0/invoke/users_manager/method/users/get-user/${userId}`
    );

    user = response1.data.data.user;

    if (!user) throw exception("An error occurred");

    if (!user.category)
      // return res.status(400).send({ "You don't have a preferences yet!");
      return res
        .status(400)
        .json({ success: false, message: "You don't have a preferences yet!" });

    // Trigger the updates
    const response = await axios.post(
      `http://localhost:3500/v1.0/invoke/users_manager/method/users/trigger-news/${userId}`
    );

    console.log("Successfully trigger updates!");
    res.status(200).send("Successfully trigger updates!");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    res.status(400).send("An error occurred");
  }
};
