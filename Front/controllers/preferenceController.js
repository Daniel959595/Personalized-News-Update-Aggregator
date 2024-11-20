const axios = require("axios");

exports.savePreferences = async (req, res) => {
  try {
    const token = req.cookies.token;

    const response = await axios.post(
      "http://other-server/preferences",
      req.body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, message: "Preferences saved successfully!" });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};
