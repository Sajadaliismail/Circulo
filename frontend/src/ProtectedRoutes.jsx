import VerifyOtp from "./components/AuthPageComponents/verifyOTp";
import SetupPage from "./pages/setupPage";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import useChatSocket from "./hooks/chatSocketHook";

export const ProtectedRoute = ({ element }) => {
  const { isEmailVerified, isLoggedIn, isSetupComplete } = useSelector(
    (state) => state.auth
  );
  // useChatSocket();

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  if (!isEmailVerified) {
    return (
      <LandingPage>
        <VerifyOtp />
      </LandingPage>
    );
  }

  if (!isSetupComplete) {
    return <SetupPage />;
  }
  if (element) return element;
  return <Navigate to={"/"} />;
};

export const AuthRoutes = ({ element }) => {
  const { isLoggedIn, isEmailVerified } = useSelector((state) => state.auth);
  if (!isLoggedIn || !isEmailVerified) {
    return element;
  } else return <Navigate to={"/"} />;
};
