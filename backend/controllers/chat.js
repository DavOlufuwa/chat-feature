const chatRouter = require("express").Router();
const Chat = require("../models/chat");
const User = require("../models/user");
const { authUserExtractor } = require("../utils/middleware");

// Accessing the User Chat List
chatRouter.get("/", authUserExtractor, async (req, res) => {
  const currentUser = req.user;
  const { otherUserId } = req.body;

  // user not logged in
  if (!currentUser) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  // other user doesn't
  if (!otherUserId) {
    return res
      .status(400)
      .send({ error: "Other user id not sent with the request" });
  }

  // Find all Chats where current user is a participant
   var foundChats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: otherUserId } } },
      { users: { $elemMatch: { $eq: currentUser.id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // Chatlist with latest messages
  foundChats = await User.populate(foundChats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (foundChats.length > 0) {
    res.status(200).send(foundChats[0]);
  } else {
    // If the chat is not found, create a new chat
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [currentUser.id, otherUserId],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ id: createdChat.id }).populate(
      "users",
      "-password"
    );

    res.status(200).send(fullChat);
  }
});

// Creating a Chat
chatRouter.post("/", authUserExtractor, async (req, res) => {});

// Accessing a Group Chat
chatRouter.get("/group/:id", authUserExtractor, async (req, res) => {});

// Creating a Group Chat
chatRouter.post("/group", authUserExtractor, async (req, res) => {});

// Renaming a Group Chat
chatRouter.put("/group/rename", authUserExtractor, async (req, res) => {});

// Removing a User from a Group Chat
chatRouter.put("/group/remove", authUserExtractor, async (req, res) => {});

// Adding a User to a Group Chat
chatRouter.put("/group/add", authUserExtractor, async (req, res) => {});

module.exports = chatRouter;
