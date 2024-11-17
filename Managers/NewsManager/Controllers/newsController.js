exports.triggerNews = async (req, res) => {
  try {
    // Send the request to the news AI service

    // Forward the data received from the news AI service to the email service

    // Notify the usersController that the user has been registered

    // console.log(req);
    console.log(req.body.data);
    res
      .status(200)
      .send({ message: "Successfully registed user for News Updates" });
    // res.sendStatus(200);
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).send("Failed to Register user");
  }
};
