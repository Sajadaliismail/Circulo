const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptRequest,
  suggestions,
  getRequests,
  cancelRequest,
  getFriends,
  getFriendsApi,
  getRelation,
  removeFriend,
} = require("../Controller/controller");
const authenticateToken = require("../Middlewares/authenticationJWT");

router.post("/send-request", authenticateToken, sendFriendRequest);
router.post("/accept-request", authenticateToken, acceptRequest);
router.post("/cancel-request", authenticateToken, cancelRequest);
router.get("/suggestions", authenticateToken, suggestions);
router.get("/friends", authenticateToken, getFriends);
router.get("/api/friendsListUser", authenticateToken, getFriendsApi);
router.get("/requests", authenticateToken, getRequests);
router.get("/relation/:id", authenticateToken, getRelation);
router.post("/removeFriend", authenticateToken, removeFriend);

module.exports = router;
