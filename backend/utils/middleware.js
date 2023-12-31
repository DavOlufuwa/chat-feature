const User = require('../models/user');
const logger = require('./logger');
const { decodeAccessToken, decodeRefreshToken } = require('./tkgenerator');



const requestLogger = (request, response, next) => {
  logger.info("--- Request Details ---");
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};


const responseLogger = (request, response, next) => {
  const { statusCode } = response;
  const originalSend = response.send;
  
  response.send = function (body) {
    logger.info("--- Response Details ---");
    logger.info("Status Code:", statusCode);
    logger.info("Body:", body);
    logger.info("---");
    originalSend.call(response, body);
  };

  next();
};


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response
      .status(400)
      .send({ error: "could not save a value to path" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token has expired" });
  }

  next();
};
const accessTokenExtractor = async (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.split(" ")[1];
  } else {
    request.token = null;
  }
  next();
};

const authUserExtractor = async (request, response, next) => {
  const verifiedUser = decodeAccessToken(request.token)

  if (!verifiedUser.id){
    return response.status(401).json({ error: "invalid or missing token" });
  } else {
    request.user = await User.findById(verifiedUser.id)
  }
  next();
}

const  refreshTokenExtractor = async (request, response, next) => {
  const cookies = request.cookies;

  if(!cookies?.jwt){
    return response.status(403).json({ error: "No cookies found" });
  }

  const refreshToken = cookies.jwt;

  const verifiedRefreshToken = decodeRefreshToken(refreshToken);

  if(!verifiedRefreshToken.id){
    return response.status(403).json({ error: "invalid or missing refresh token" });
  }

  request.user = await User.findById(verifiedRefreshToken.id)

  next();
}





module.exports = {
  requestLogger,
  responseLogger,
  unknownEndpoint,
  errorHandler,
  accessTokenExtractor,
  refreshTokenExtractor,
  authUserExtractor
}