const express = require("express");
const axios = require("axios");

const newsApiController = require("./Controllers/NewaApiController.js");
const app = express();
const PORT = 3003;

app.use(express.json());

app.get("/fetch-news", newsApiController.fetchNews);

app.listen(PORT, () => {
  console.log(`NewsApiController running on port ${PORT}`);
});
