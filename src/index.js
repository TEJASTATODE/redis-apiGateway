require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
require("./config/redis");
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users",userRoutes)
app.post("/users", (req, res) => {
  res.send("POST /users is working");
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
