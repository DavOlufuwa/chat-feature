const User = require("../models/user");
const { hashPassword } = require("../utils/passwordHandler");

const userRouter = require("express").Router();

// create new user

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .send({ error: "User with this email already exists" });
  }

  const passwordHash = await hashPassword(password);

  const userToSave = new User({
    name,
    email,
    password : passwordHash,
  });

  const response = await userToSave.save();

  res.status(201).send(response);
});

module.exports = userRouter;
