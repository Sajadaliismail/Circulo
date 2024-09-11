import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Homepage from "./pages/homePage";
import LandingPage from "./pages/landingPage";

import { AuthRoutes, ProtectedRoute } from "./ProtectedRoutes";
import ChatPage from "./pages/chatPage";
import VideoCall from "./pages/VideoCall";
import UserPage from "./pages/UserPage";
import useChatSocket from "./hooks/chatSocketHook";

function App() {
  useChatSocket();

  return (
    <SnackbarProvider maxSnack={5}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<AuthRoutes element={<LandingPage></LandingPage>} />}
          />
          <Route path="/" element={<ProtectedRoute element={<Homepage />} />} />
          <Route
            path="/chats"
            element={<ProtectedRoute element={<ChatPage />} />}
          />
          <Route
            path="/profile/:userId"
            element={<ProtectedRoute element={<UserPage />} />}
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
