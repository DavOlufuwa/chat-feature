const jwt = require("jsonwebtoken");
const { refreshTokenExtractor } = require("../utils/middleware");
const { generateAccessToken } = require("../utils/tkgenerator");
const refreshRouter = require("express").Router();

refreshRouter.get("/", refreshTokenExtractor, async (req, res) => {
  const refresheduser = req.user;

  const userforToken = {
    id: refresheduser.id,
    name: refresheduser.name,
    email: refresheduser.email,
    profilePhoto: refresheduser.profilePhoto,
  };

  const newAccessToken = generateAccessToken(userforToken);

  res.status(200).send({
    id: refresheduser.id,
    email: refresheduser.email,
    name: refresheduser.name,
    profilePhoto: refresheduser.profilePhoto,
    accessToken: newAccessToken,
  });
});


module.exports = refreshRouter