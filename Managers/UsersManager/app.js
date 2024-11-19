const express = require("express");

const userRoutes = require("./routes/userRoutes.js");

// const connectDB = require("./config/database.js");

const app = express();
const PORT = 3001;

app.use(express.json());

// Connect to the database
// connectDB();

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`UsersManager running on port ${PORT}`);
});
