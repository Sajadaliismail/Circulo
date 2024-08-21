export const isLocationValid = (location) => {
  const errors = {};
  if (!location.city.trim()) {
    errors.city = "City is required";
  }
  if (!location.country.trim()) {
    errors.country = "Country is required";
  }
  if (!location.state.trim()) {
    errors.state = "State is required";
  }
  if (!location.postalCode.trim()) {
    errors.postalCode = "Postal Code is required";
  }
  return errors;
};

export const convertUTCToIST = (utcDateString) => {
  const utcDate =
    typeof utcDateString === "number"
      ? new Date(utcDateString)
      : new Date(utcDateString);

  if (isNaN(utcDate.getTime())) {
    return "Invalid Date";
  }

  const now = new Date();
  const differenceInDays = Math.floor(
    (now.getTime() - utcDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const timeDiff = (now.getTime() - utcDate.getTime()) / 1000;

  if (timeDiff < 60) return "just now";
  if (timeDiff < 3600) {
    const min = Math.floor(timeDiff / 60);
    return `${min} minute${min > 1 ? "s" : ""} ago`;
  }

  if (differenceInDays === 0) {
    return utcDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } else if (differenceInDays === 1) {
    return "yesterday";
  } else {
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
};

export const handleNewMessage = (
  { roomId, senderId, message, type, _id },
  setmsg
) => {
  setmsg((chats) => {
    const prevChats = { ...chats };
    const chatRoom = prevChats[roomId] || { messages: [] };
    const chatMessages = chatRoom.messages;

    const isDuplicate = chatMessages.some((msg) => msg._id === _id);

    if (isDuplicate) {
      return prevChats;
    }

    if (type === "image") {
      prevChats[roomId] = {
        ...chatRoom,
        messages: [
          ...chatMessages,
          {
            imageUrl: message,
            timestamp: Date.now(),
            senderId,
            _id,
          },
        ],
      };
    } else if (type === "text") {
      prevChats[roomId] = {
        ...chatRoom,
        messages: [
          ...chatMessages,
          {
            message,
            timestamp: Date.now(),
            senderId,
            _id,
          },
        ],
      };
    }
    return prevChats;
  });
};
