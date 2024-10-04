const { Notification } = require("../Models/notificationSchema");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const getSignedUrlForUpload = async (req, res) => {
  try {
    const s3 = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    const { fileName, fileType } = req.query;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({ uploadUrl: signedUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error.message);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
};

module.exports = { getSignedUrlForUpload };

// const { getSignedUrl } = require("@aws-sdk/s3");

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
    // console.log("notfication saved", notification);
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
    // console.log(data);
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
  getSignedUrlForUpload,
};
