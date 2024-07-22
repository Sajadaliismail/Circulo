import './App.css';
import Homepage from './pages/homePage';
// import  Button from '@mui/material/Button';
import SignInSide from './pages/signIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signup';
import LandingPage from './pages/landingPage';
import ResetPassword from './pages/resetPassword';
import { SnackbarProvider } from 'notistack';
import VerifyOtp from './pages/verifyOTp';

function App() {
  return (
    <>
    <SnackbarProvider maxSnack={5}>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LandingPage children={<SignInSide />}  />} />
        <Route path="/signup" element={<LandingPage children={<SignUp/>}  />} />
        <Route path="/resetpassword" element={<LandingPage children={<ResetPassword/>}  />} />
        <Route path="/verify" element={<LandingPage children={<VerifyOtp/>}  />} />
        {/* Other routes */}
      </Routes>
    </Router>
    </SnackbarProvider>
    </>
  );
}

export default App;
