import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./feautures/auth/authSlice";
import postsSlice from "./feautures/posts/postsSlice";
import friendsSlice from "./feautures/friends/friendsSlice";
import chatsSlice from "./feautures/chats/chatsSlice";

const store = configureStore({
    reducer:{
    auth:authSlice,
    posts:postsSlice,
    friends:friendsSlice,
    chats:chatsSlice}
})

export default store