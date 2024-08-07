import { Send } from "@mui/icons-material";
import {
  Grid,
  List,
  Divider,
  TextField,
  Fab,
  Typography,
  Avatar,
  Box,
  Paper,
} from "@mui/material";

const MessageArea = ({
  handleSubmit,
  message,
  setMessage,
  friend,
  messages,
}) => {
  function convertUTCToIST(utcDateString) {
    const utcDate =
      typeof utcDateString === "number"
        ? new Date(utcDateString)
        : new Date(utcDateString);
    if (isNaN(utcDate.getTime())) {
      return "Invalid Date";
    }
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return utcDate.toLocaleString("en-IN", options);
  }

  if (!friend || !friend.id) {
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
          Click on any of the chat
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
        sx={{
          height: "70vh",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {messages && messages.messages && messages.messages.length ? (
          messages.messages.map((mess) => (
            <Paper
              key={mess._id}
              elevation={2}
              sx={{
                marginLeft: mess.senderId === friend.id ? "15px" : "auto",
                marginRight: "10px",
                maxWidth: "45%",
                bgcolor: mess.senderId === friend.id ? "#3c94ecd1" : "#d7ffcc",
                minHeight: "40px",
                alignContent: "center",
                padding: 1,
                borderRadius: 3,
                marginBottom: 1,
              }}
            >
              <Typography variant="subtitle2">
                {mess.senderId === friend.id
                  ? `${friend.firstName} ${friend.lastName}`
                  : "You"}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: mess.senderId === friend.id ? "left" : "right",
                  fontSize: "20px",
                }}
              >
                {mess.message}
              </Typography>
              <Typography variant="caption">
                {convertUTCToIST(mess.timestamp)}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="h4" sx={{ marginX: "auto" }}>
            No messages
          </Typography>
        )}
      </List>
      <Divider />
      <Grid container sx={{ padding: "20px" }}>
        <Grid item xs={11}>
          <TextField
            id="outlined-basic-email"
            label="Type your message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
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
