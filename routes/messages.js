const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Message =  mongoose.model("Message");

//add msg

router.post("/addmsg", async (req, res) => {
  const { conversationId, senderId, text } = req.body;
    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //get msg
  
  router.get("/getmsg/:conversationId", async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  });




module.exports = router;