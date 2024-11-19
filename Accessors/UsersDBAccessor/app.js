const express = require("express");

const connectDB = require("./config/database.js");
const usersDBController = require("./controllers/usersDBController.js");

const app = express();
const PORT = 3005;

app.use(express.json());

// Connect to the database
connectDB();

app.post("/save-user", usersDBController.saveUser);

app.listen(PORT, () => {
  console.log(`NewsApiAccessor is running on port ${PORT}`);
});
