import { atom, atomFamily } from "recoil";

export const ChatFriendsData = atom({
  key: "chatRoomsState",
  default: [],
});

export const ChatRoomMessages = atom({
  key: "chatRoomMessages",
  default: {},
});
