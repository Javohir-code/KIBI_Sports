const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
      useFindAndModify: false,
    });
    console.log("Connected to Mongodb...");
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = db;
