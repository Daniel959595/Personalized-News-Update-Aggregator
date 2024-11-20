const express = require("express");

const preferencesController = require("../controllers/preferenceController");
const viewsController = require("../controllers/viewsController");
const router = express.Router();

// Preferences Dashboard
router.get("/dashboard", viewsController.dashboardPage);

// Preferences Page
router.get("/edit", viewsController.preferencePage);

// Save Preferences
router.post("/save", preferencesController.savePreferences);

module.exports = router;
