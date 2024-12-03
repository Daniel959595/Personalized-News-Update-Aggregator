const express = require("express");
const bodyParser = require("body-parser");

const newsController = require("./controllers/newsController.js");

const app = express();
app.use(bodyParser.json({ type: "application/*+json" }));

const port = 3002;

// app.post("/register-user", (req, res) => {
//   console.log(req.body.data);
//   res.sendStatus(200);
// });

app.post("/register-user", newsController.fetchNews);

// app.post("/register-user", (req, res) => {
//   console.log(req.body.data);
//   newsController.triggerNews(data);
//   res.sendStatus(200);
// });

app.listen(port, () => console.log(`consumer app listening on port ${port}`));
