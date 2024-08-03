const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDb connected to User services");
  } catch (error) {
    console.log("Error connecting to Mongodb : User services", error);
  }
};

module.exports = connectDb;
