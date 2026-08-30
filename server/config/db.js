const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
