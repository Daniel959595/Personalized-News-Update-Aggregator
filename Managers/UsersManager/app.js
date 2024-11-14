const express = require("express");

const newsController = require("./Controllers/newsController.js");
const app = express();
const PORT = 3001;

// app.get("/", (req, res) => {
//   // res.status(200).send({ massage: "Respnonse from UsersManager!" });
// });

app.post("/", newsController.triggerNews);

app.listen(PORT, () => {
  console.log(`UsersManager running on port ${PORT}`);
});
