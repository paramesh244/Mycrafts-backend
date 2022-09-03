const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
          type: String,
        },
        senderId: {
          type: String,
        },
        text: {
          type: String,
        },
      },
      { timestamps: true }
    );
mongoose.model("Message",messageSchema)