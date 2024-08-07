// redis.js
const { createClient } = require("redis");
require("dotenv").config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST_URL = process.env.REDIS_HOST_URL;

const connectRedis = async (client) => {
  client.on("error", (err) => console.error("Redis Client Error", err));
  client.on("connect", () => console.log("Redis client connected"));
  client.on("reconnecting", () => console.log("Redis client reconnecting"));
  client.on("end", () => console.log("Redis client disconnected"));
  await client.connect();
};

const client = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST_URL,
    port: 15088,
  },
});

connectRedis(client).catch((err) =>
  console.error("Failed to connect Redis client:", err)
);

const pubClient = client.duplicate();
const subClient = client.duplicate();
const userClient = client.duplicate();

connectRedis(pubClient).catch((err) =>
  console.error("Failed to connect pubClient:", err)
);
connectRedis(subClient).catch((err) =>
  console.error("Failed to connect subClient:", err)
);
connectRedis(userClient).catch((err) =>
  console.error("Failed to connect userClient:", err)
);

module.exports = { client, pubClient, subClient, userClient };
