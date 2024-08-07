const express = require("express");
const cors = require("cors");

const { httpServer } = require("./Server/Services/socket_io");
const connectDb = require("./Server/Database/mongodb");
const route = require("./Server/Routes/routes");
require("dotenv").config();

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();

const corsOption = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Chat services connected to port : ${PORT}`);
});
app.use("/chats", route);
httpServer.listen(3010, () => {
  console.log(`Socket.IO server listening on port 3010`);
});

connectDb();
