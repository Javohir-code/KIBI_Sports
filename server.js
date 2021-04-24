const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./controllers/db");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`${PORT} port listened in ${process.env.NODE_ENV} mode...`);
});
