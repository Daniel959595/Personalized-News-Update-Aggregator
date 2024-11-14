const { DaprClient } = require("@dapr/dapr");

const DAPR_HOST = process.env.DAPR_HOST || "http://localhost";
const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || "3501";
const PUBSUB_NAME = "pubsub";
const PUBSUB_TOPIC = "news";

const client = new DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_HTTP_PORT,
});

exports.triggerNews = async (req, res) => {
  try {
    const message = { message: "Message from the Queue!" };

    // Publish message using the Dapr client
    await client.pubsub.publish(PUBSUB_NAME, PUBSUB_TOPIC, message);

    console.log(`Successfully added message to queue - ${message.message}`);
    res.status(200).send({ message: "Registered user for News Updates" });
  } catch (error) {
    console.error("Error publishing request:", error);
    res.status(500).send("Failed to Register user");
  }
};
