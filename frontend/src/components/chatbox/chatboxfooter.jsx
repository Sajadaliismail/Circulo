import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { InputAdornment, TextField } from '@mui/material';

const ChatBoxFooter = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const submitMessage = () => {
    if (!message.trim()) {
      return;
    }

    onSubmit(message.trim());
    setMessage('');
  };

  return (
    <TextField
      placeholder="Message here ..."
      className="w-full"
      style={{ borderRadius: 999 }}
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          submitMessage();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" className="hover:cursor-pointer hover:text-blue-500">
            <SendIcon onClick={submitMessage} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ChatBoxFooter;
