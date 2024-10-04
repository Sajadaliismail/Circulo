import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Fab,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import { convertUTCToIST } from "../../pages/Utilitis";
import { AddReaction, Close } from "@mui/icons-material";
import VoiceMessagePlayer from "../CommonComponents/VoicePlayer";
import { useState } from "react";

export const RecieverMessageList = ({ mess }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textWrap: "wrap",
        }}
      >
        <Box
          className="bg-blue-600 text-white"
          key={mess._id}
          elevation={2}
          sx={{
            maxWidth: "55%",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            paddingX: mess?.imageUrl || mess?.voiceUrl ? 0 : 2,
            paddingY: mess?.imageUrl || mess?.voiceUrl ? 0 : 0.5,
            borderRadius: mess?.imageUrl || mess?.voiceUrl ? 10 : 3,

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
            <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
              {mess.message}
            </Typography>
          )}
          {mess?.imageUrl && (
            <img
              style={{ maxHeight: "350px", borderRadius: 5 }}
              alt="message"
              src={mess.imageUrl}
              onClick={handleClickOpen}
            />
          )}
          {mess.voiceUrl && <VoiceMessagePlayer audioSrc={mess.voiceUrl} />}
        </Box>
        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogContent sx={{ marginX: "auto", overflow: "hidden" }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <img
            src={mess.imageUrl}
            alt="enlarged message"
            style={{ maxHeight: "80vh" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const SenderMessageList = ({ mess, friend, handleEmoji, roomId }) => {
  const emojis = ["😀", "😂", "❤️", "👍", "👎"];
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            maxWidth: "55%",
            overflowWrap: "break-word",
            wordWrap: "break-word",

            paddingX: mess?.imageUrl || mess?.voiceUrl ? 0 : 2,
            paddingY: mess?.imageUrl || mess?.voiceUrl ? 0 : 0.5,
            borderRadius: mess?.imageUrl || mess?.voiceUrl ? 10 : 3,
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
            <img
              style={{ maxHeight: "350px", borderRadius: 5 }}
              alt="message"
              src={mess.imageUrl}
              onClick={handleClickOpen}
            />
          )}
          {mess.voiceUrl && <VoiceMessagePlayer audioSrc={mess.voiceUrl} />}
        </Box>

        <Typography variant="caption">
          {convertUTCToIST(mess.timestamp)}
        </Typography>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <img
            src={mess.imageUrl}
            alt="enlarged message"
            style={{ height: "100%", width: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
