const mongoose = require("mongoose");
const color = require("colors");
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
