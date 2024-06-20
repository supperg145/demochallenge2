const User = require("../model/user.js");
const Message = require("../model/message.js");

getMessageBoard = (req, res) => {
    const userId = res.locals.id;


    const userMessagesQuery = Message.find({ userId: userId });


    userMessagesQuery.then((userMessages) => {

        res.render("messageBoard", { userMessages: userMessages });
    }).catch((err) => {
        console.log("Error fetching messages:", err);
    });
}

postMessage =(req, res) => {
  console.log(req.body);
  console.log(req.cookies);
  const messageWithId = {
    ...req.body,
    userId: res.locals.id,
  };
  const message = new Message(messageWithId);
  message.save()
  .then(res.redirect("messageBoard"))
  //find messages by looking for res.locals.id log messages
  //push message._id to new array in users, then populate, show the message object
/*const foundUser = User.findOne({ email: res.locals.email });
  foundUser
    .then((user) => user.messages.push(message._id))
    .then((result) => console.log(result));*/

};



module.exports = {
  getMessageBoard,
  postMessage,
};
