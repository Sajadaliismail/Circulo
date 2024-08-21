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
} = require("../Controller/controller");
const authenticateToken = require("../Middlewares/authenticationJWT");

router.post("/send-request", authenticateToken, sendFriendRequest);
router.post("/accept-request", authenticateToken, acceptRequest);
router.post("/cancel-request", authenticateToken, cancelRequest);
router.get("/suggestions", authenticateToken, suggestions);
router.get("/friends", authenticateToken, getFriends);
router.get("/api/friendsListUser/:userId", getFriendsApi);
router.get("/requests", authenticateToken, getRequests);

module.exports = router;
