import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authSlice from "./features/auth/authSlice";
import postsSlice from "./features/posts/postsSlice";
import friendsSlice from "./features/friends/friendsSlice";
import chatsSlice from "./features/chats/chatsSlice";
import userSlice from "./features/user/userSlice";

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine your reducers
const appReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  posts: postsSlice,
  friends: friendsSlice,
  chats: chatsSlice,
});

// Create the rootReducer to handle the LOGOUT action
const rootReducer = (state, action) => {
  if (action.type === "auth/setLogout") {
    // Clear the persisted state
    storage.removeItem("persist:root");
    // Reset the state
    state = undefined;
  }
  return appReducer(state, action);
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Create the persistor
const persistor = persistStore(store);
// persistor.purge();

// Export the store and persistor
export { store, persistor };
