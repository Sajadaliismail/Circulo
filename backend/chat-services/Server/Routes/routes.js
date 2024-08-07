const express = require("express");
const authenticateToken = require("../Middlewares/authenticationJWT");
const Rooms = require("../Models/mongoDb");

const route = express.Router();

route.get("/fetchchat", authenticateToken, async (req, res) => {
  try {
    console.log(req.query);
    const { id } = req.query;
    const userId = req.userId;

    const roomId = [userId, id].sort().join("");
    let chat = await Rooms.findOne({ roomId: roomId });
    if (!chat) {
      chat = new Rooms({
        roomId: roomId,
        messages: [],
      });
      await chat.save();
    }
    return res.status(200).json({ success: true, chat: chat });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ failed: true });
  }
});

module.exports = route;
