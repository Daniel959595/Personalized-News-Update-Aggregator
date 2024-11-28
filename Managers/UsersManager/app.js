const express = require("express");

const userRoutes = require("./routes/userRoutes.js");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`UsersManager running on port ${PORT}`);
});
