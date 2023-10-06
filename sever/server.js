import express from "express";
import cors from "cors";
require("dotenv").config();
import initRoutes from "./src/routes";
require("./src/config/connection_db");
require("./passport");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

// Run server
const PORT = process.env.PORT || 8088;

const listener = app.listen(PORT, () => {
  console.log("Server listening on PORT " + listener.address().port);
});
