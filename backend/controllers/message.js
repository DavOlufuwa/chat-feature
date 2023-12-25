const messageRouter = require("express").Router();
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");

// sending a message
messageRouter.post("/", async (req, res) => {
  const sender = req.user;
  const { content, chatId } = req.body;

  if (!sender) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  const newMessage = new Message({
    sender: sender.id,
    content: content,
    chat: chatId,
  });

  let createdMessage = await newMessage.save();

  // Populate the created message
  createdMessage = await createdMessage.populate("sender", "name profilePhoto");
  createdMessage = await createdMessage.populate("chat");
  createdMessage = await User.populate(createdMessage, {
    path: "chat.users",
    select: "name profilePhoto email",
  });

  // Find the chat and update the latest message
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: createdMessage,
  });

  res.status(200).send(createdMessage);
});

// fetching all messages within a single chat
messageRouter.get("/:chatId", async (req, res) => {

  const currentUser = req.user;
  const { chatId } = req.params;

  if (!currentUser) {
    return res.status(401).send({ error: "Unauthorized action. Please Login" });
  }

  // finding all the messages of a particular chat
  const messages = await Message.find({chat : chatId}).populate("sender", "name profilePhoto email").populate("chat");


  res.status(200).send(messages);
  // Populate the found messages
});

module.exports = messageRouter;
