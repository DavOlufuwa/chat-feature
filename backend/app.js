const express = require("express");
const cors = require("cors");
require("express-async-errors");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const logger = require("./utils/logger");
const userRouter = require("./controllers/users");
const {
  requestLogger,
  responseLogger,
  unknownEndpoint,
  errorHandler,
  accessTokenExtractor,
  authUserExtractor,
} = require("./utils/middleware");
const loginRouter = require("./controllers/authentication");
const chatRouter = require("./controllers/chat");
const messageRouter = require("./controllers/message");
const refreshRouter = require("./controllers/refresh");

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

app.use(express.json()); // for parsing application/json
app.use(cors());
app.use(requestLogger);
app.use(responseLogger);
app.use(accessTokenExtractor);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/chat", authUserExtractor, chatRouter);
app.use("/api/message", authUserExtractor, messageRouter)
app.use("/api/refresh", refreshRouter)
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
