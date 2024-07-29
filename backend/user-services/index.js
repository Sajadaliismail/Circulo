require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./server/dbConnection/mongodbConnection");
const route = require("./server/routes/userRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOption));

app.use("/", route);
connectDb();
app.listen(3002, () => {
  console.log("Server is connected");
});
