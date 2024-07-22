const mongoose = require('mongoose')
require('dotenv').config()

const URI = process.env.MONGOURI
const connectDb = async()=>{
    try {
        await mongoose.connect(URI)
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
        console.log('Error connecting to the database');
    }
}

module.exports = connectDb