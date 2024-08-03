import { Forum, ThumbUp, ThumbUpAlt, ThumbUpOffAlt } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

function CommentComponent({ comment, handLike }) {
  useEffect(() => {
    // console.log(comment);
  });
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <Avatar></Avatar>
        {comment.userDetails.firstName}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "5px",
          textAlign: "start",
        }}
      >
        <Typography variant="body2">{comment.content}</Typography>
      </Box>
      <Box>
        <Button
        //   onClick={() => handLike(postData._id)}
        >
          {comment.hasLiked ? <ThumbUpAlt /> : <ThumbUpOffAlt />}
        </Button>
      </Box>
    </>
  );
}

export default CommentComponent;
