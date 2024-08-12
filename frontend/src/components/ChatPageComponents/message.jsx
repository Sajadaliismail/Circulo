import {
  Avatar,
  Box,
  Fab,
  Paper,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import { convertUTCToIST } from "../../pages/Utilitis";
import { AddReaction } from "@mui/icons-material";

export const RecieverMessageList = ({ mess }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-end",
          textWrap: "wrap",
        }}
      >
        <Paper
          key={mess._id}
          elevation={2}
          sx={{
            maxWidth: "45%",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            bgcolor: "#d7ffcc",
            paddingX: 2,
            paddingY: 1,
            borderRadius: 3,
            marginBottom: 1,
            position: "relative",
          }}
        >
          {mess?.emoji && (
            <Fab
              sx={{
                position: "absolute",
                bottom: -5,
                left: -20,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
            >
              {mess?.emoji}
            </Fab>
          )}
          {mess.message && (
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "right",
              }}
            >
              {mess?.message}
            </Typography>
          )}
          {mess.imageUrl && (
            <img style={{ maxWidth: "100%" }} src={mess.imageUrl} />
          )}
        </Paper>

        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
    </>
  );
};

export const SenderMessageList = ({ mess, friend, handleEmoji }) => {
  const emojis = ["😀", "😂", "❤️", "👍", "👎"];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "flex-start",
          textWrap: "wrap",
        }}
      >
        <Paper
          key={mess._id}
          elevation={2}
          sx={{
            maxWidth: "45%",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            bgcolor: "#3c94ecd1",
            paddingX: 2,
            paddingY: 1,
            borderRadius: 3,
            marginBottom: 1,
            position: "relative",
          }}
        >
          {mess?.emoji ? (
            <SpeedDial
              ariaLabel="Emoji"
              color="black"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -30,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
              icon={mess.emoji}
              direction="right"
            >
              {emojis.map((action) => (
                <SpeedDialAction
                  sx={{ fontSize: "20px", margin: "8px 0" }}
                  key={action}
                  icon={action}
                  onClick={() => {
                    handleEmoji(mess._id, action, friend);
                  }}
                />
              ))}
            </SpeedDial>
          ) : (
            <SpeedDial
              ariaLabel="Emoji"
              color="black"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -30,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
              icon={<AddReaction color="primary" />}
              direction="right"
            >
              {emojis.map((action) => (
                <SpeedDialAction
                  sx={{ fontSize: "20px", margin: "8px 0" }}
                  key={action}
                  icon={action}
                  onClick={() => handleEmoji(mess._id, action, friend)}
                />
              ))}
            </SpeedDial>
          )}

          {mess.message && (
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "left",
              }}
            >
              {mess?.message}
            </Typography>
          )}
          {mess.imageUrl && (
            <img style={{ maxWidth: "100%" }} src={mess.imageUrl} />
          )}
        </Paper>

        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
    </>
  );
};
