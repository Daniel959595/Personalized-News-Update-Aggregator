const express = require("express");

const usersController = require("./Controllers/usersController.js");
const app = express();
const PORT = 3001;

// app.get("/", (req, res) => {
//   // res.status(200).send({ massage: "Respnonse from UsersManager!" });
// });

app.post("/", usersController.triggerNews);

app.listen(PORT, () => {
  console.log(`UsersManager running on port ${PORT}`);
});
