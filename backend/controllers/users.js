const User = require("../models/user");
const { hashPassword } = require("../utils/passwordHandler");

const userRouter = require("express").Router();

// create new user

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, image } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .send({ error: "User with this email already exists" });
  }

  const passwordHash = await hashPassword(password);

  const newUser = image === "" ? {
    name,
    email,
    password : passwordHash
  } : {
    name,
    email,
    password : passwordHash,
    profilePhoto: image
  }


  const userToSave = new User(newUser);

  const response = await userToSave.save();

  res.status(201).send(response);
});


// Image upload

module.exports = userRouter;
