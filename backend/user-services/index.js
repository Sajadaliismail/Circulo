require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./Server/DBConnection/mongodbConnection");
const route = require("./Server/Routes/userRoutes");
const { subscribeMessage } = require("./Server/Services/rabbitmq");
const {
  updatePost,
  deletePost,
  updateStatus,
} = require("./Server/Repositories/userRepository");

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const app = express();
app.use(cookieParser());

const corsOption = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

subscribeMessage("userStatus", updateStatus);

// subscribeMessage("post_created", updatePost);
// subscribeMessage("post_deleted", deletePost);
app.use("/", route);

connectDb();
app.listen(PORT, () => {
  console.log(`User services listening on PORT ${PORT}!`);
});
