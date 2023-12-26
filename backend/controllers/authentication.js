const User = require("../models/user");
const { comparePassword } = require("../utils/passwordHandler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tkgenerator");

const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  const correctPassword =
    user === null ? false : await comparePassword(password, user.password);

  if (!user) {
    return res.status(401).json({
      error: "Incorrect email",
    });
  }

  if (!correctPassword) {
    return res.status(401).json({
      error: "Incorrect password",
    });
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  };

  const accessToken = generateAccessToken(userForToken);

  const refreshToken = generateRefreshToken(userForToken);

  user.refreshToken = refreshToken;

  await user.save();

  res
    .status(200)
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      SameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .send({
      id: user.id,
      email: user.email,
      name: user.name,
      profilePhoto: user.profilePhoto,
      accessToken: accessToken,
    });
});

module.exports = loginRouter;
