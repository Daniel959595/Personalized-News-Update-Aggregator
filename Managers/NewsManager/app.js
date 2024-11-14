const { DaprServer } = require("@dapr/dapr");

const daprHost = process.env.DAPR_HOST || "http://localhost";
const daprPort = process.env.DAPR_HTTP_PORT || "3502";
const serverHost = process.env.SERVER_HOST || "127.0.0.1";
const serverPort = process.env.APP_PORT || 3002;
const pubSubName = "pubsub";
const pubSubTopic = "news";

async function main() {
  const server = new DaprServer({
    serverHost,
    serverPort,
    clientOptions: {
      daprHost,
      daprPort,
    },
  });

  // Dapr subscription routes orders topic to this route
  server.pubsub.subscribe(pubSubName, pubSubTopic, (data) =>
    console.log("Subscriber received: " + JSON.stringify(data))
  );

  await server.start();
}

main().catch((e) => console.error(e));
