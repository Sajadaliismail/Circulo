const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: String },
  type: {
    type: String,
    enum: ["request_accepted", "comment", "like", "reply"],
    required: true,
  },
  sender: [{ type: String }],
  contentId: { type: String },
  contentType: {
    type: String,
    enum: ["Post", "Comment"],
  },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const userNotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

notificationSchema.pre("save", async function (next) {
  const notification = this;

  if (notification.skipMiddleware) {
    return next();
  }

  // console.log("notification triggered");

  if (notification.type === "request_accepted") {
    return next();
  }

  const existingNotification = await mongoose.model("Notification").findOne({
    user: notification.user,
    contentId: notification.contentId,
    type: notification.type,
  });

  if (existingNotification) {
    const senderIndex = existingNotification.sender.indexOf(
      notification.sender[0]
    );

    if (senderIndex === 0) {
      existingNotification.createdAt = new Date();
      existingNotification.isRead = false;
      existingNotification.skipMiddleware = true;
      await existingNotification.save();
      const err = new Error("Duplicate notification");
      err.name = "DuplicateNotificationError";
      return next(err);
    }

    if (senderIndex !== -1) {
      existingNotification.sender.splice(senderIndex, 1);
    }

    existingNotification.createdAt = new Date();

    existingNotification.sender.unshift(notification.sender[0]);
    existingNotification.isRead = false;

    existingNotification.skipMiddleware = true;
    await existingNotification.save();

    const err = new Error("Duplicate notification");
    err.name = "DuplicateNotificationError";
    return next(err);
  }

  next();
});

notificationSchema.post("save", async function (doc) {
  // console.log(doc, "postsave");
  // console.log("saved");

  await mongoose
    .model("UserNotification")
    .findOneAndUpdate(
      { user: doc.user },
      { $addToSet: { notifications: doc._id } },
      { new: true, upsert: true }
    );
});

const Notification = mongoose.model("Notification", notificationSchema);
const UserNotification = mongoose.model(
  "UserNotification",
  userNotificationSchema
);

module.exports = { Notification, UserNotification };
