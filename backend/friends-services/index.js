require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = require("./Server/Routes/router");
const { subscribeMessage } = require("./Server/Services/rabbitmq");
const {
  addUserDetails,
  updateProfilePicture,
} = require("./Server/Services/services");

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const app = express();

const corsOption = {
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

subscribeMessage("User_signup_queue", addUserDetails);
subscribeMessage("User_imageUpdate_queue", updateProfilePicture);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.use("/friends", router);

app.listen(PORT, () => {
  console.log(`Post services listening on PORT ${PORT}!`);
});
