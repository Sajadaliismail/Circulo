import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authSlice from "./features/auth/authSlice";
import postsSlice from "./features/posts/postsSlice";
import friendsSlice from "./features/friends/friendsSlice";
import chatsSlice from "./features/chats/chatsSlice";
import userSlice from "./features/user/userSlice";
import { combineReducers } from 'redux';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  posts: postsSlice,
  friends: friendsSlice,
  chats: chatsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefault)=>getDefault({
     serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  })
});

const persistor = persistStore(store);

export { store, persistor };
