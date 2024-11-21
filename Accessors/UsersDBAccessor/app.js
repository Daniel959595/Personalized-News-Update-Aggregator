const express = require("express");

const connectDB = require("./config/database.js");
const usersDBController = require("./controllers/usersDBController.js");

const app = express();
const PORT = 3005;

app.use(express.json());

// Connect to the database
connectDB();

app.post("/signup", usersDBController.signup);
app.post("/login", usersDBController.login);

app.get("/get-user/:id", usersDBController.getUserById);
app.get("/get-all-users", usersDBController.getAllUsers);

app.patch("/users/:id/preferences", usersDBController.setUserPreference);

app.listen(PORT, () => {
  console.log(`NewsApiAccessor is running on port ${PORT}`);
});
