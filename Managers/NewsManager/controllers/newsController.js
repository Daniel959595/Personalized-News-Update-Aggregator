const axios = require("axios");

exports.fetchNews = async (req, res) => {
  try {
    console.log("Got massage from the queue!");
    // console.log(req.body.data);

    const { category, q, emailAddress } = req.body.data;

    // Is there is a need to check parameters ? (middleware ?)

    // Fetch the data from news_api_accessor
    const response = await axios.get(
      `http://localhost:3502/v1.0/invoke/news_api_accessor/method/fetch-news?category=${category}&q=${q}`
    );

    // Extract the necessary data
    const articles = response.data.results.map((article) => ({
      article_id: article.article_id,
      title: article.title,
      link: article.link,
      description: article.description,
    }));

    // Respond to the rabbitmq (?) immediately
    res.sendStatus(200);

    // Send the data to another api for summarizing // check if already exist in cache

    // Forward the data received from the news AI service to the email service
    transferData(articles, emailAddress).catch((error) => {
      console.error("Error transferring data asynchronously: ", error);
    });

    // Notify the usersController that the user has been registered (?)

    // console.log(articles);
    // res.status(200).send({ message: "Successfully fetched News Updates" });
    // res.sendStatus(200);
  } catch (error) {
    console.error("Error fetching News Updates: ", error);
    res.status(500).send("Failed to fetch News Updates");
  }
};

const transferData = async (articles, emailAddress) => {
  try {
    // Send data to the MailService (email option)
    await axios.post(
      "http://localhost:3502/v1.0/invoke/mail_accessor/method/email/send-news",
      {
        emailAddress,
        articles,
      }
    );
    console.log("Data successfully transferred to the MailService");
  } catch (error) {
    console.error("Error transferring data to MailService: ", error.AxiosError);
  }
};

// Create another function to handle failure - direct massage to sender? (add sender id to massage) another rabbitmq queue?
