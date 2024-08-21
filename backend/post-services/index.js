require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDb = require("./Server/DBConnection/mongoDbConnection");
const route = require("./Server/Routes/routes");

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

app.use("/posts", route);

connectDb();
app.listen(PORT, () => {
  console.log(`Post services listening on PORT ${PORT}!`);
});
