import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Homepage from "./pages/homePage";
import LandingPage from "./pages/landingPage";
import SignInSide from "./components/AuthPageComponents/signIn";
import SignUp from "./components/AuthPageComponents/signup";
import ResetPassword from "./components/CommonComponents/resetPassword";
import { AuthRoutes, ProtectedRoute } from "./ProtectedRoutes";
import ChatPage from "./pages/chatPage";
import VideoCall from "./pages/VideoCall";

function App() {
  return (
    <SnackbarProvider maxSnack={5}>
      <Router>
        <Routes>
          <Route
            path="/signup"
            element={
              <AuthRoutes
                element={
                  <LandingPage>
                    <SignUp />
                  </LandingPage>
                }
              />
            }
          />
          <Route
            path="/resetpassword"
            element={
              <AuthRoutes
                element={
                  <LandingPage>
                    <ResetPassword />
                  </LandingPage>
                }
              />
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoutes
                element={
                  <LandingPage>
                    <SignInSide />
                  </LandingPage>
                }
              />
            }
          />
          <Route path="/verify" element={<ProtectedRoute />} />
          <Route path="/" element={<ProtectedRoute element={<Homepage />} />} />
          <Route
            path="/chats"
            element={<ProtectedRoute element={<ChatPage />} />}
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
