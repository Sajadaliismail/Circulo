const express = require("express");
const authenticateToken = require("../Middlewares/authenticationJWT");
const postsController = require("../Controllers/postsController");
const commentController = require("../Controllers/commentController");
const replyController = require("../Controllers/replyController");
const upload = require("../Middlewares/multerUpload");
const route = express.Router();

route.post(
  "/addpost",
  authenticateToken,
  upload.single("image"),
  postsController.addPosts
);

route.get(
  "/fetchuserposts/:id",
  authenticateToken,
  postsController.fetchUserPosts
);

route.get("/fetchposts", authenticateToken, postsController.fetchPosts);
route.get(
  "/fetchPostData/:id",
  authenticateToken,
  postsController.fetchPostData
);
route.post("/handlelike", authenticateToken, postsController.handleLike);
route.delete("/deletepost/:id", authenticateToken, postsController.deletePosts);

route.post("/addcomment", authenticateToken, commentController.addComment);
route.get("/fetchComments", authenticateToken, commentController.fetchComment);
route.post("/likeComments", authenticateToken, commentController.handleLike);
route.delete(
  "/deletecomment/:id",
  authenticateToken,
  commentController.deleteComment
);

route.post("/addReply", authenticateToken, replyController.addReply);
route.get("/fetchReplies", authenticateToken, replyController.fetchReply);
route.post("/likeReply", authenticateToken, replyController.handleLike);
route.delete("/reply/:id", authenticateToken, replyController.deleteReply);

module.exports = route;
