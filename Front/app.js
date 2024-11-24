const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const updateRoutes = require("./routes/updatesRoutes");

const authController = require("./controllers/authController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/auth", authRoutes);

app.use(authController.checkAuth);
app.use("/", indexRoutes);
app.use("/preference", preferenceRoutes);
app.use("/updates", updateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
