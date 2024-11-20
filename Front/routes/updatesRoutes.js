const express = require("express");
const updatesController = require("../controllers/updatesController");
const router = express.Router();

router.post("/", updatesController.getUpdates);

module.exports = router;
