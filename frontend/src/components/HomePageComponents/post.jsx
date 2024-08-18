import { ForumOutlined, ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  IconButton,
  Paper,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CommentComponent from "./comments";
import { useDispatch } from "react-redux";
import { addComment } from "../../features/posts/postsAsyncThunks";
import { convertUTCToIST } from "../../pages/Utilitis";
import HoverComponent from "../CommonComponents/HoverComponen";

function Post({ postData, handLike, fetchUserData }) {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const submitComment = async () => {
    dispatch(addComment({ comment: commentContent, postId: postData._id }));
  };

  const handleOpen = async () => {
    console.log(postData);

    setOpen((prev) => !prev);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:3004/posts/fetchComments?postId=${postData._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setComments(data.posts);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Paper
        elevation={5}
        sx={{ borderRadius: "10px", padding: "10px", my: "10px" }}
      >
        <Box
          onMouseOver={() => {
            fetchUserData(postData?.authorDetails._id);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",

            [`&:hover .posts-${postData._id}-${postData?.authorDetails._id}`]: {
              visibility: "visible",
            },
            position: "relative",
          }}
        >
          <Avatar
            sx={{ width: 30, height: 30, my: 1 }}
            src={postData?.authorDetails?.profilePicture}
          >
            {postData?.authorDetails?.firstName?.[0]?.toUpperCase()}
          </Avatar>
          {postData?.authorDetails?.firstName}
          <Typography variant="caption" sx={{ marginLeft: "auto" }}>
            {convertUTCToIST(postData?.createdAt)}
          </Typography>
          <HoverComponent
            component={`posts-${postData._id}`}
            id={postData?.authorDetails._id}
          />
        </Box>
        <Divider variant="fullWidth"></Divider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "5px",
            textAlign: "start",
            width: "100%",
          }}
        >
          <Typography variant="body2">{postData.content}</Typography>
          {postData.image && (
            <Box
              component="img"
              src={postData.image}
              alt="postImage"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}
        </Box>
        <Box>
          <ButtonGroup
            variant="text"
            sx={{
              alignItems: "center",
              justifyItems: "center",
              borderRadius: "50px",
            }}
            aria-label="Loading button group"
          >
            <IconButton onClick={() => handLike(postData._id)}>
              {postData.hasLiked ? (
                <ThumbUpAlt color="primary" />
              ) : (
                <ThumbUpOffAlt color="primary" />
              )}
            </IconButton>
            {postData.likesCount > 0 && (
              <Chip
                size="small"
                color="primary"
                variant="filled"
                label={`${postData.likesCount}`}
              ></Chip>
            )}
            <Button onClick={handleOpen}>
              <ForumOutlined />
            </Button>
          </ButtonGroup>
        </Box>
        {!open && (
          <Paper elevation={8} sx={{ paddingX: "10px", marginTop: "10px" }}>
            <Typography variant="body1" sx={{ fontWeight: "200" }}>
              Comments
            </Typography>
            <TextareaAutosize
              placeholder="Share your opinion..."
              minRows={2}
              maxLength={300}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              style={{
                flex: 1,
                resize: "none",
                border: "none",
                outline: "none",
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                padding: "5px",
              }}
            />
            <Box className="flex justify-end py-2">
              <Button
                onClick={submitComment}
                variant="contained"
                className="ms-auto "
                sx={{ borderRadius: "50px" }}
              >
                Comment
              </Button>
            </Box>
            <Box>
              {comments &&
                comments.map((comment) => (
                  <CommentComponent key={comment._id} comment={comment} />
                ))}
            </Box>
          </Paper>
        )}
      </Paper>
    </>
  );
}

export default Post;
