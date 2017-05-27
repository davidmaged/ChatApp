var mongoose = require('mongoose');

var ChatsSchema = mongoose.Schema({
  user1: {
    type: String,
    required: true
  },
  user2: {
    type: String,
    required: true
  },
  message:
  [
    {
      content: { type: String },
      date: { type: Date },
      sender:
      {
        type: String,
        required: true
      }
    }
  ]

});

var Chats = mongoose.model("Chats",ChatsSchema);
module.exports = Chats;
