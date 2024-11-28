const axios = require("axios");

const { DaprClient } = require("@dapr/dapr");

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3501";
const PUBSUB_NAME = "pubsub";
const PUBSUB_TOPIC = "news";

const client = new DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_HTTP_PORT,
});

// Helper function to check if Dapr sidecar is available
const checkDaprSidecar = async (timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(
        `${DAPR_HOST}:${DAPR_HTTP_PORT}/v1.0/healthz`
      );
      if (response.ok) {
        return true;
      }
    } catch (err) {
      // Continue trying until the timeout expires
    }
    // Wait briefly before trying again
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
};

exports.triggerNews = async (req, res) => {
  try {
    // Check Dapr sidecar readiness with a 5-second timeout
    // const isSidecarReady = await checkDaprSidecar(4000);
    // if (!isSidecarReady) {
    //   console.log(`NewsManager's Dapr Sidecar is not available`);
    //   return res.status(500).send("Sorry, Please try again later");
    // }

    const { id } = req.params;

    console.log(`trigger news - ${id}`);

    // Get user preferences from the DB Accessor
    const response = await axios.get(
      `http://localhost:3501/v1.0/invoke/users_db_accessor/method/get-user/${id}`
    );

    const user = response.data.data.user;
    const { category, q, email } = user;

    if ((!category && !q) || !email) {
      return res.status(400).send({
        error: "Failed to Trigger news",
      });
    }

    const message = { category: category, q: q, emailAddress: email };

    // Publish message using the Dapr client
    await client.pubsub.publish(PUBSUB_NAME, PUBSUB_TOPIC, message);

    console.log(`Successfully added message to queue!`);
    res.status(200).send("Successfully Triggered News");
  } catch (error) {
    console.error("Error:", error.response?.statusText || "Failed");
    res.status(500).send("Failed to Trigger news");
  }
};

exports.setPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, text } = req.body;
    console.log(`${id} -${category}, ${text}`);

    // Update the user data in db through UserDbAccessor
    const response = await axios.patch(
      `http://localhost:3501/v1.0/invoke/users_db_accessor/method/users/${id}/set-preference`,
      {
        category,
        text,
      }
    );
    // Return the updated user
    const user = response.data.data.user;
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    console.error("Faild to set preference: ", error.response.data);
    res.status(error.response?.status || 400).send(error.response.data);
  }
};

exports.getUser = async (req, res) => {
  try {
    // Update the user data in db through UserDbAccessor
    const userId = req.params.id;
    console.log(userId);
    const response = await axios.get(
      `http://localhost:3501/v1.0/invoke/users_db_accessor/method/get-user/${userId}`
    );

    const user = response.data.data.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.response && error.response.status === 404)
      console.error("Error:", error.response.data);
    res
      .status(error.response?.status || 400)
      .send(error.response?.data || "Failed to get user");
  }
};
