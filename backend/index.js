const app = require("./app");
const { PORT } = require("./utils/config");
const logger = require("./utils/logger");

app.listen(PORT, () => {
  logger.info(`Server started and running on port ${PORT}`);
});
