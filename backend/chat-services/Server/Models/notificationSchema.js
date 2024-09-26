const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["friend_request", "request_accepted", "comment", "like"],
    required: true,
  },
  sender: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  contentId: { type: mongoose.Schema.Types.ObjectId, refPath: "contentType" },
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

  const existingNotification = await mongoose.model("Notification").findOne({
    user: notification.user,
    contentId: notification.contentId,
    type: notification.type,
  });

  if (existingNotification) {
    const isSenderExists = existingNotification.sender.includes(
      notification.sender[0]
    );

    if (!isSenderExists) {
      existingNotification.sender.push(notification.sender[0]);
      await existingNotification.save();

      await mongoose
        .model("UserNotification")
        .findOneAndUpdate(
          { user: notification.user },
          { $push: { notifications: existingNotification._id } },
          { new: true, upsert: true }
        );
    }

    return next(
      new Error("Duplicate notification found, updating existing notification.")
    );
  } else {
    next();
  }
});

notificationSchema.post("save", async function (doc) {
  await mongoose
    .model("UserNotification")
    .findOneAndUpdate(
      { user: doc.user },
      { $push: { notifications: doc._id } },
      { new: true, upsert: true }
    );
});

const Notification = mongoose.model("Notification", notificationSchema);
const UserNotification = mongoose.model(
  "UserNotification",
  userNotificationSchema
);

module.exports = { Notification, UserNotification };
