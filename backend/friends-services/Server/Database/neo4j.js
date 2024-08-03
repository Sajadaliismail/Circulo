const neo4j = require("neo4j-driver");

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

const connectNeo = async () => {
  const session = driver.session();
  try {
    // Run a simple query to check connectivity
    await session.run("RETURN 1");
    console.log("Connection established");
  } catch (error) {
    console.error(`Connection error\n${error}\nCause: ${error.cause}`);
  } finally {
    await session.close();
  }
};

const closeConnection = async () => {
  try {
    await driver.close();
    console.log("Driver closed");
  } catch (error) {
    console.error(`Error closing driver\n${error}\nCause: ${error.cause}`);
  }
};

module.exports = {
  connectNeo,
  closeConnection,
  driver,
};
