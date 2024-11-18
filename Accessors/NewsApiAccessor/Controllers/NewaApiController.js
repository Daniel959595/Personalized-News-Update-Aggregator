const axios = require("axios");

const API_KEY = "pub_59496e0815c0be93a500d29156774964142d3";

exports.fetchNews = async (req, res) => {
  try {
    const { category, q, emailAddres } = req.query;

    if (!category && !q) {
      return res
        .status(400)
        .send({ error: "Either category or q is required" });
    }

    // Add language option ?
    let apiUrl = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
    if (q) {
      apiUrl += `&q="${encodeURIComponent(q)}"`;
    }
    if (category) {
      apiUrl += `&category=${encodeURIComponent(category)}`;
    }

    const response = await axios.get(apiUrl);

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).send({ error: "Failed to fetch news" });
  }
};
