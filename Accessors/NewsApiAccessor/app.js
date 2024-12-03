const express = require("express");

const newsApiController = require("./controllers/NewaApiController.js");
const app = express();
const PORT = 3003;

app.use(express.json());

app.get("/fetch-news", newsApiController.fetchNews);

app.listen(PORT, () => {
  console.log(`NewsApiAccessor is running on port ${PORT}`);
});
