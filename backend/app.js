const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");

const app = express();

mongoose.set("strictQuery", false);
logger.info(`connecting to ${MONGODB_URI}`);

// connect to DB
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message)
  );

app.use(express.json());
app.use(cors());

module.exports = app;
