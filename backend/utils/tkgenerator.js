const jwt = require("jsonwebtoken");

const generateAccessToken = (obj) => {
  return jwt.sign(obj, process.env.SECRET_TOKEN_KEY, {
    expiresIn: "24h",
  });
};

const decodeAccessToken = (token) => {
  return jwt.verify(token, process.env.SECRET_TOKEN_KEY);
};

const generateRefreshToken = (token) => {
  return jwt.sign(obj, process.env.SECRET_REFRESH_KEY, {
    expiresIn: "24h",
  });
};

const decodeRefreshToken = (token) => {
  return jwt.verify(token, process.env.SECRET_REFRESH_KEY);
}


module.exports = {
  generateAccessToken,
  decodeAccessToken,
  generateRefreshToken,
  decodeRefreshToken
}