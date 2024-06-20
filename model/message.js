const mongoose = require("mongoose");
const moment = require("moment");

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function (created_at) {
      return moment(created_at).format("YYYY-MM-DD HH:mm:ss");
    },
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
