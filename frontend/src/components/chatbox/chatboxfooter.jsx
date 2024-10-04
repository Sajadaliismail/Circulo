import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { InputAdornment, TextField } from "@mui/material";
import { useEffect } from "react";
import chatSocket from "../../features/utilities/Socket-io";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setReadMessages } from "../../features/chats/chatsSlice";

const ChatBoxFooter = ({ onSubmit, friend, roomId, isTyping }) => {
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const { userData } = useSelector((state) => state.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    chatSocket.emit("userIsTyping", {
      id: friend,
      roomId: roomId,
      userIsTyping,
    });
  }, [userIsTyping]);

  const submitMessage = () => {
    if (!message.trim()) {
      return;
    }
    dispatch(setReadMessages(friend));
    onSubmit(message.trim());
    setMessage("");
  };

  return (
    <>
      {isTyping ? (
        <>
          <span className="text-blue-950 dark:text-white flex flex-row flex-nowrap items-center gap-1 mx-3">
            <b>{userData[friend]?.firstName} </b> is typing
            <PulseLoader color="#1976d2" size={5} />
          </span>
        </>
      ) : null}
      <TextField
        placeholder="Message here ..."
        className="w-full"
        style={{ borderRadius: 999 }}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
          if (!userIsTyping) setUserIsTyping(true);
          else if (message.trim().length <= 2) setUserIsTyping(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setUserIsTyping(false);
            submitMessage();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              className="hover:cursor-pointer hover:text-blue-500"
            >
              <SendIcon onClick={submitMessage} />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default ChatBoxFooter;
