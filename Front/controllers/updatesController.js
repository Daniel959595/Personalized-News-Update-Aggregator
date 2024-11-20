const axios = require("axios");

// Handle "Get Updates" action
exports.getUpdates = async (req, res) => {
  try {
    const token = req.cookies.token;

    const response = await axios.post(
      "http://other-server/updates",
      { preferences: req.body.preferences },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json({ success: true, message: response.data.message });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    res.status(400).json({ success: false, message: errorMessage });
  }
};
