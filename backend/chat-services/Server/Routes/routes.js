const express = require("express");
const authenticateToken = require("../Middlewares/authenticationJWT");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const { Rooms } = require("../Models/mongoDb");
const { default: mongoose } = require("mongoose");

const route = express.Router();

route.get("/fetchchat", authenticateToken, async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.userId;

    const roomId = [userId, id].sort().join("");

    const chats = await Rooms.aggregate([
      {
        $match: { roomId: roomId },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messageDetails",
        },
      },
      {
        $addFields: {
          messageDetails: {
            $cond: {
              if: { $eq: [{ $size: "$messageDetails" }, 0] },
              then: [],
              else: "$messageDetails",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$messageDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "messageDetails.timestamp": -1 },
      },
      {
        $limit: 30,
      },
      {
        $sort: { "messageDetails.timestamp": 1 },
      },
      {
        $group: {
          _id: "$_id",
          roomId: { $first: "$roomId" },
          messages: { $push: "$messageDetails" },
          user1: { $first: "$user1" },
          user2: { $first: "$user2" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$messageDetails.receiverId",
                        new mongoose.Types.ObjectId(userId),
                      ],
                    },
                    { $eq: ["$messageDetails.hasRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          roomId: 1,
          messages: 1,
          unreadCount: 1,
          user1: 1,
          user2: 1,
        },
      },
    ]);
    let chat = chats[0];

    if (!chat) {
      chat = new Rooms({
        roomId: roomId,
        messages: [],
        user1: id,
        user2: userId,
      });
      await chat.save();
    }

    return res.status(200).json({ success: true, chat: chat });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ failed: true });
  }
});

route.get("/fetchAllChats", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await Rooms.aggregate([
      {
        $match: {
          $or: [
            { roomId: { $regex: `^${userId}` } },
            { roomId: { $regex: `${userId}$` } },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messageDetails",
        },
      },
      {
        $addFields: {
          messageDetails: {
            $cond: {
              if: { $eq: [{ $size: "$messageDetails" }, 0] },
              then: [],
              else: "$messageDetails",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$messageDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "messageDetails.timestamp": -1 }, // Sort messages by timestamp in descending order
      },
      {
        $group: {
          _id: "$_id",
          roomId: { $first: "$roomId" },
          messages: { $push: "$messageDetails" },
          user1: { $first: "$user1" },
          user2: { $first: "$user2" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$messageDetails.receiverId",
                        new mongoose.Types.ObjectId(userId),
                      ],
                    },
                    { $eq: ["$messageDetails.hasRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          latestMessageTimestamp: { $max: "$messageDetails.timestamp" }, // Get the latest message timestamp for sorting
        },
      },
      {
        $sort: { latestMessageTimestamp: -1 }, // Sort chat rooms by the latest message timestamp in descending order
      },
      {
        $project: {
          _id: 1,
          roomId: 1,
          messages: 1,
          unreadCount: 1,
          user1: 1,
          user2: 1,
        },
      },
    ]);

    return res.status(200).json({ success: true, chats: chats });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ failed: true });
  }
});

route.get("/fetchChatFriends", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const chatFriends = await Rooms.aggregate([
      {
        $match: {
          $or: [
            { user1: new mongoose.Types.ObjectId(userId) },
            { user2: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          otherUserId: {
            $cond: {
              if: { $eq: ["$user1", new mongoose.Types.ObjectId(userId)] },
              then: "$user2",
              else: "$user1",
            },
          },
          roomId: 1,
          updatedAt: 1,
          messages: 1,
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messageDetails",
        },
      },
      {
        $addFields: {
          unreadCount: {
            $size: {
              $filter: {
                input: "$messageDetails",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.senderId", "$otherUserId"] },
                    { $eq: ["$$message.hasRead", false] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: "$otherUserId",
          roomId: 1,
          unreadCount: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ]);

    return res.status(200).json({ chatFriends });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

module.exports = route;