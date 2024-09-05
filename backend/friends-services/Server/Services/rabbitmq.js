const amqp = require("amqplib");
const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;

async function connect() {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL, {
      heartbeat: 60,
    });
    return connection;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

async function createChannel(connection) {
  try {
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error("Error creating RabbitMQ channel:", error);
    throw error;
  }
}

async function publishMessage(queue, message) {
  const connection = await connect();
  const channel = await createChannel(connection);

  try {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queue}:`, message);
  } catch (error) {
    console.error("Error publishing message:", error);
  } finally {
    await channel.close();
    await connection.close();
  }
}

async function subscribeMessage(queue, callback) {
  const connection = await connect();
  const channel = await createChannel(connection);

  try {
    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in queue: ${queue}`);

    channel.consume(
      queue,
      async (msg) => {
        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log("Received message:", messageContent);
          await callback(messageContent);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error subscribing to messages:", error);
  }
}

module.exports = {
  publishMessage,
  subscribeMessage,
};
