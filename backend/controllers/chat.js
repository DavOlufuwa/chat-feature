const chatRouter = require("express").Router();
const Chat = require("../models/chat");
const User = require("../models/user");
const { authUserExtractor } = require("../utils/middleware");

// Accessing the User Chat List
chatRouter.post("/", async (req, res) => {
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
    .populate("users")
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
      "users"
    );

    res.status(200).send(fullChat);
  }
});

// fetching all the Chats
chatRouter.get("/", async (req, res) => {
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  const foundChats = await Chat.find({
    users: { $elemMatch: { $eq: currentUser.id } },
  })
    .populate("users")
    .populate("groupAdmin")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const foundChatList = await User.populate(foundChats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  res.status(200).send(foundChatList);
});

// Creating a Group Chat
chatRouter.post("/group", async (req, res) => {
  const currentUser = req.user;
  const { name, users } = req.body;

  if (!currentUser) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  let userList = JSON.parse(users);

  if (userList.length < 2) {
    return res
      .status(400)
      .send({ error: "More than 2 users are required to form a group chat" });
  }

  // userList.unshift(currentUser.id);

  const groupChat = new Chat({
    chatName: name,
    users: userList,
    isGroupChat: true,
    groupAdmin: currentUser._id,
  });

  const createdGroupChat = await groupChat.save();

  const groupChatId = createdGroupChat._id;

  const fullGroupChat = await Chat.findOne({ _id: groupChatId })
    .populate("users", "-refreshToken")
    .populate("groupAdmin");

  res.status(201).send(fullGroupChat);
});

// Renaming a Group Chat
chatRouter.put("/group/rename", async (req, res) => {
  const { chatId, newChatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId, { chatName: newChatName }, { new: true })
    .populate("users", "-refreshToken").populate("groupAdmin");
  
  if (updatedChat) {
    res.status(200).send(updatedChat);
  } else {
    res.status(400).send({ error: "Chat not found" });
  }
});

// Accessing a Group Chat
chatRouter.get("/group/:id", async (req, res) => {});

// Removing a User from a Group Chat
chatRouter.put("/group/remove", async (req, res) => {});

// Adding a User to a Group Chat
chatRouter.put("/group/add", async (req, res) => {});

module.exports = chatRouter;
