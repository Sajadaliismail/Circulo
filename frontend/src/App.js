import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Homepage from "./pages/homePage";
import LandingPage from "./pages/landingPage";
import SignInSide from "./components/AuthPageComponents/signIn";
import SignUp from "./components/AuthPageComponents/signup";
import ResetPassword from "./components/AuthPageComponents/resetPassword";
import { AuthRoutes, ProtectedRoute } from "./ProtectedRoutes";
import ChatPage from "./pages/chatPage";
import VideoCall from "./pages/VideoCall";
import UserPage from "./pages/UserPage";
import useChatSocket from "./hooks/chatSocketHook";
import chatSocket from "./features/utilities/Socket-io";
import { fetchUser } from "./features/user/userAsyncThunks";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const [msg, setmsg] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useChatSocket();

  return (
    <SnackbarProvider maxSnack={5}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<AuthRoutes element={<LandingPage></LandingPage>} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<Homepage msg={msg} setmsg={setmsg} />}
              />
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute
                element={<ChatPage msg={msg} setmsg={setmsg} />}
              />
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute
                element={<UserPage msg={msg} setmsg={setmsg} />}
              />
            }
          />
          <Route
            path="/video"
            element={<ProtectedRoute element={<VideoCall />} />}
          />
          <Route path="/setup" element={<ProtectedRoute />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
