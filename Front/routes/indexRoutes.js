const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/viewsController.js");
const authController = require("../controllers/authController.js");

router.get("/", viewsController.homePage);
router.post("/logout", authController.logout);

module.exports = router;
