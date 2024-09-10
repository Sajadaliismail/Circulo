const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { httpServer } = require("./Server/Services/socket_io");
const connectDb = require("./Server/Database/mongodb");
const route = require("./Server/Routes/routes");
require("dotenv").config();

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const SOCKET_PORT = process.env.SOCKET_PORT;

const app = express();

app.use(cookieParser());
const corsOption = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/chats", route);

app.listen(PORT, () => {
  console.log(`Chat services connected to port : ${PORT}`);
});

httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on ${SOCKET_PORT}`);
});

connectDb();
