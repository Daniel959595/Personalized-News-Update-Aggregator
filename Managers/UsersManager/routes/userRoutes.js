const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// router.post("/preference", userController.setPreference);
router.post("/trigger-news", userController.triggerNews);

module.exports = router;
