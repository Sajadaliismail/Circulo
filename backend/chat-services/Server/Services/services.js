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

const newCommentNotification = async (data) => {
  try {
    const { post, postAuthor, commentedBy, activity } = data;

    const notification = new Notification({
      contentId: post,
      type: "comment",
      user: postAuthor,
      sender: [commentedBy],
      message: activity,
    });
    await notification.save();
    console.log("notfication saved", notification);
  } catch (error) {
    console.log(error.message);
  }
};

const newReplyNotification = async (data) => {
  console.log(data);
  try {
    const { post, commentAuthor, commentedBy, activity } = data;

    const notification = new Notification({
      contentId: post,
      type: "reply",
      user: commentAuthor,
      sender: [commentedBy],
      message: activity,
    });
    await notification.save();
    // console.log("notfication saved", notification);
  } catch (error) {
    console.log(error.message);
  }
};

const newLikeNotification = async (data) => {
  try {
    console.log(data);
    const { post, postAuthor, likedBy, activity } = data;

    const notification = new Notification({
      contentId: post,
      type: "like",
      user: postAuthor,
      sender: [likedBy],
      message: activity,
    });
    await notification.save();
    // post: post.post._id,
    //     postAuthor: post.post.author,
    //     likedBy: userId,
    //     activity: "has liked your post.",
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  // handleIncomingRequestNotification,
  handleRequestAccepetedNotification,
  newCommentNotification,
  newLikeNotification,
  newReplyNotification,
};
