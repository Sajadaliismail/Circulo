const { Notification } = require("../Models/notificationSchema");

const handleIncomingRequestNotification = async (data) => {
  console.log("incoming request", data);

  const { sender, user } = data;
  const notification = new Notification({
    type: "friend_request",
    user: user,
    sender: [sender],
  });
  await notification.save();
};
const handleRequestAccepetedNotification = async (data) => {
  const { sender, user } = data;
};

module.exports = {
  handleIncomingRequestNotification,
  handleRequestAccepetedNotification,
};
