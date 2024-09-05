import {
  Box,
  Fab,
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
        <Box
          className="bg-blue-600 text-white"
          key={mess._id}
          elevation={2}
          sx={{
            maxWidth: "45%",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            paddingX: mess?.imageUrl ? 0 : 2,
            paddingY: mess?.imageUrl ? 0 : 0.5,
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
        </Box>

        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
    </>
  );
};

export const SenderMessageList = ({ mess, friend, handleEmoji, roomId }) => {
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
        <Box
          className="bg-gray-700 text-white"
          key={mess._id}
          elevation={2}
          sx={{
            maxWidth: "45%",
            overflowWrap: "break-word",
            wordWrap: "break-word",

            paddingX: mess?.imageUrl ? 0 : 2,
            paddingY: mess?.imageUrl ? 0 : 0.5,
            borderRadius: 3,
            marginBottom: 1,
            position: "relative",
          }}
        >
          {mess?.emoji ? (
            <SpeedDial
              ariaLabel="Emoji"
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
                    handleEmoji(mess._id, action, friend, roomId);
                  }}
                />
              ))}
            </SpeedDial>
          ) : (
            <SpeedDial
              ariaLabel="Emoji"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -30,
                width: 30,
                height: 30,
                minHeight: 30,
              }}
              icon={
                <AddReaction className="text-cyan-700 bg-white rounded-full" />
              }
              direction="right"
            >
              {emojis.map((action) => (
                <SpeedDialAction
                  sx={{ fontSize: "20px", margin: "8px 0" }}
                  key={action}
                  icon={action}
                  onClick={() => handleEmoji(mess._id, action, friend, roomId)}
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
        </Box>

        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
    </>
  );
};
