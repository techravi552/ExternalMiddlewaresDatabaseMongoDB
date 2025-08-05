const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const libraryRoutes = require("./routes/library.routes");

dotenv.config();
const app = express();
app.use(express.json());

connectDB();
app.use("/", libraryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
