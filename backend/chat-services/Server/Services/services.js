const { Notification } = require("../Models/notificationSchema");

// const handleIncomingRequestNotification = async (data) => {
//   console.log("incoming request", data);

//   const { sender, user } = data;
//   const notification = new Notification({
//     type: "friend_request",
//     user: user,
//     sender: [sender],
//   });
//   await notification.save();
// };
const handleRequestAccepetedNotification = async (data) => {
  const { sender, user } = data;
  const notification = new Notification({
    type: "request_accepted",
    user: user,
    sender: [sender],
    message: "have accepted your friend request",
  });
  await notification.save();
};

module.exports = {
  // handleIncomingRequestNotification,
  handleRequestAccepetedNotification,
};
