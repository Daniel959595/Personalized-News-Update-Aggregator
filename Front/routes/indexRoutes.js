const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

router.get("/", authController.checkAuth, (req, res) => {
  res.redirect("/preferences/dashboard");
});

module.exports = router;
