import Message from "../models/messagesModel.js";
import Conversation from "../models/conversationModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiver } = req.params;
    const { message } = req.body;
    const sender = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      const newConversation = new Conversation({
        participants: [sender, receiver],
      });
      await newConversation.save();
      conversation = newConversation;
    }

    const newMessage = new Message({
      sender,
      receiver,
      message,
    });

    conversation.messages.push(newMessage._id);

    //socket.io will go here

    await Promise.all([newMessage.save(), conversation.save()]);

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiver } = req.params;
    const sender = req.user._id;

    if (sender.toString() === receiver.toString()) {
      return res
        .status(400)
        .json({ error: "Cannot send messages to yourself." });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteMessage = (req, res) => {};