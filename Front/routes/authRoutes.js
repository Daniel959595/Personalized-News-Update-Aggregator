const express = require("express");

const authController = require("../controllers/authController");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.get("/login", viewsController.loginPage);
router.get("/signup", viewsController.signupPage);

router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
