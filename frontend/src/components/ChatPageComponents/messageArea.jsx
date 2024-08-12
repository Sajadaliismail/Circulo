// "use strict";
import { AttachFile, Send } from "@mui/icons-material";
import {
  Grid,
  List,
  Divider,
  TextField,
  Fab,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { RecieverMessageList, SenderMessageList } from "./message";

const MessageArea = ({
  handleSubmitImage,
  setImage,
  handleSubmit,
  message,
  setMessage,
  friend,
  messages,
  handleEmoji,
}) => {
  const messageEl = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (messageEl.current) {
        messageEl.current.scroll({
          top: messageEl.current.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    if (messageEl.current) {
      observer.observe(messageEl.current, { childList: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    handleSubmitImage();
  };

  if (!friend || !friend._id) {
    return (
      <Grid
        container
        sx={{
          padding: "20px",
          height: "70vh",
          alignContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ marginX: "auto" }}>
          Click on any of the chataf
        </Typography>
      </Grid>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          paddingLeft: "10px",
        }}
      >
        <Avatar src={friend.profilePicture}>{friend.firstName[0]}</Avatar>
        <Typography>
          {friend.firstName} {friend.lastName}
        </Typography>
      </Box>

      <List
        ref={messageEl}
        sx={{
          paddingX: "20px",
          height: "60vh",
          overflowY: "auto",
          flexGrow: 1,
          overflowX: "hidden",
          scrollbarWidth: "none",
        }}
      >
        {messages?.messages?.length ? (
          messages.messages.map((mess) =>
            mess?.senderId == friend.id ? (
              <SenderMessageList
                mess={mess}
                friend={friend.id}
                handleEmoji={handleEmoji}
              ></SenderMessageList>
            ) : (
              <RecieverMessageList mess={mess}></RecieverMessageList>
            )
          )
        ) : (
          <Typography variant="h4" sx={{ marginX: "auto" }}>
            No messages
          </Typography>
        )}
      </List>
      <Divider />
      <Grid container sx={{ padding: "20px" }}>
        <Grid item xs={10}>
          <TextField
            id="outlined-basic-email"
            label="Type your message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={1} align="right">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="contained-button-file">
            <Fab component="span">
              <AttachFile></AttachFile>
            </Fab>
          </label>
        </Grid>
        <Grid item xs={1} align="right">
          <Fab
            onClick={(e) => handleSubmit(friend.id, e)}
            color="primary"
            aria-label="send"
          >
            <Send />
          </Fab>
        </Grid>
      </Grid>
    </>
  );
};

export default MessageArea;
