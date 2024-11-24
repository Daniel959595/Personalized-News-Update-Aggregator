const axios = require("axios");

exports.savePreferences = async (req, res) => {
  try {
    // console.log(req.body);

    const userId = req.user._id;

    const response = await axios.patch(
      `http://localhost:3500/v1.0/invoke/users_manager/method/users/set-preference/${userId}`,
      req.body
      // { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Successfully updated preference!");
    res.status(201).json({
      status: "success",
      // data: {
      //   user,
      // },
    });

    // return res.status(201).send("Preferences saved successfully");
  } catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.message || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};
