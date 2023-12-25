const User = require("../models/user");
const { authUserExtractor } = require("../utils/middleware");
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

  // if image is not sent
  const newUser =
    image === ""
      ? {
          name,
          email,
          password: passwordHash,
        }
      : {
          name,
          email,
          password: passwordHash,
          profilePhoto: image,
        };

  const userToSave = new User(newUser);

  const response = await userToSave.save();

  res.status(201).send(response);
});

// User Search Get All Users

userRouter.get("/", authUserExtractor, async (req, res) => {

  if (!req.user) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Find all users except logged in user
  const foundUsers = await User.find(keyword)
  .find({
    _id: { $ne: req.user.id },
  });

  res.status(200).send(foundUsers);
});

module.exports = userRouter;
