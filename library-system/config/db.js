const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" DB error:", err.message);
  }
};

module.exports = connectDB;
