const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard");
const {isLoggedIn} = require("../middleware");

router.get("/", isLoggedIn, dashboardController.renderDashboard);

module.exports = router;