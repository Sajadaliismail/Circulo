const {
  sendFriendRequestService,
  acceptFriendRequest,
  getSuggestions,
  getRequestsService,
  cancelFriendRequest,
  getFriendsService,
  getFriendsServiceApi,
  getUserRelation,
  removeUserFriend,
} = require("../Services/services");

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
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
  const postalCode = req.query;

  try {
    const result = await getSuggestions(userId, postalCode);

    res.status(200).json({ suggestions: result });
  } catch (error) {
    console.log(error);

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

const getFriendsApi = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await getFriendsServiceApi(userId);

    res.status(200).json({ friends: result });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getRelation = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const result = await getUserRelation(id, userId);
    return res.status(200).json({ relation: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const removeFriend = async (req, res) => {
  const userId = req.userId;
  const { friendId } = req.body;

  try {
    const result = await removeUserFriend(friendId, userId);
    return res.status(200).json({ friendId: friendId, result });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ error: error.message });
  }
};
module.exports = {
  sendFriendRequest,
  acceptRequest,
  suggestions,
  getRequests,
  cancelRequest,
  getFriends,
  getFriendsApi,
  removeFriend,
  getRelation,
};
