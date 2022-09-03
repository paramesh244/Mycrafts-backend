const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Conversation =  mongoose.model("Conversation");



//new conv

router.post("/newconv", async (req, res) => {
   
 
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //get conv of a user
  
  router.get("/conv/:userId", async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // get conv includes two userId
  
  router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // router.post("/newcon", async (req, res) => {
  //   const conversation = await Conversation.findOne({
  //     members: { $all: [req.params.senderId, req.params.receiverId] },
  //   });
  //   if(conversation){

  //     res.status(200).json(conversation)
      
  //   }
  //   else{

  //     const newConversation = new Conversation({
  //       members: [req.body.senderId, req.body.receiverId],
  //     });
    
  
  //   try {
  //     const savedConversation = await newConversation.save();
  //     res.status(200).json(savedConversation);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }}
  // });

  


module.exports = router;