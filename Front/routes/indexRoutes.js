const express = require("express");
const router = express.Router();
// const authController = require("../controllers/authController.js");
const viewsController = require("../controllers/viewsController.js");

// router.get("/", (req, res) => {
//   res.redirect("/preference/dashboard");
// });

router.get("/", viewsController.homePage);

module.exports = router;
