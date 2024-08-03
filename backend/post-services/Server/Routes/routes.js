const express = require("express");
const authenticateToken = require("../Middlewares/authenticationJWT");
const postsController = require("../Controllers/postsController");
const commentController = require("../Controllers/commentController");
const upload = require("../Middlewares/multerUpload");
const route = express.Router();

route.post(
  "/addpost",
  authenticateToken,
  upload.single("image"),
  postsController.addPosts
);
route.get("/fetchposts", authenticateToken, postsController.fetchPosts);
route.post("/handlelike", authenticateToken, postsController.handleLike);

route.post("/addcomment", authenticateToken, commentController.addComment);
route.get("/fetchComments", authenticateToken, commentController.fetchComment);

module.exports = route;
