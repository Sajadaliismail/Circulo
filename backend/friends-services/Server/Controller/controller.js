const {
  sendFriendRequestService,
  acceptFriendRequest,
  getSuggestions,
  getRequestsService,
  cancelFriendRequest,
  getFriendsService,
} = require("../Services/services");

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  console.log(req.body);
  const userId = req.userId;
  try {
    await sendFriendRequestService(userId, friendId);
    res.status(200).send("Friend request sent");
  } catch (error) {
    console.log(error);
    res.status(402).json({ err: error.message });
  }
};

const acceptRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.userId;

  try {
    await acceptFriendRequest(userId, friendId);
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server error" });
  }
};

const cancelRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.userId;

  try {
    await cancelFriendRequest(userId, friendId);
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Server error" });
  }
};

const suggestions = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await getSuggestions(userId);
    res.status(200).json({ suggestions: result });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getRequests = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await getRequestsService(userId);

    res.status(200).json({ requests: result });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
const getFriends = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await getFriendsService(userId);

    res.status(200).json({ friends: result });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
module.exports = {
  sendFriendRequest,
  acceptRequest,
  suggestions,
  getRequests,
  cancelRequest,
  getFriends,
};
