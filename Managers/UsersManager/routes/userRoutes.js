const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/get-user/:id", userController.getUser);

router.patch("/set-preference/:id", userController.setPreference);
// router.post("/trigger-news", userController.triggerNews);
router.post("/trigger-news/:id", userController.triggerNews);

module.exports = router;
