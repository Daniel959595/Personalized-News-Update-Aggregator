const mongoose = require("mongoose");

const dbURI = "mongodb://mongodb:27017/usersDb";

// Add reconnection ?
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);

    // Is that what we want ?
    process.exit(1);
  }
};

module.exports = connectDB;
