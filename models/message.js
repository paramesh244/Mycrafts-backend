const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
          type: String,
        },
        sender: {
          type: String,
        },
        text: {
          type: String,
        },
      },
      { timestamps: true }
    );
mongoose.model("Message",messageSchema)