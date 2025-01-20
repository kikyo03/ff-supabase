import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './css/Theme';

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./components/Wrapper";
import Profile from "./pages/Profile";
import ReportForm from "./components/ReportForm";
import Test from "./pages/Test";
import History from "./pages/History";
// import Map from "./components/Map";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Landing />} />

          {/* Register */}
          <Route path="/signup" element={<Signup />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Test page */}
          <Route path="/test" element={<Test />} />

          {/* Dashboard with nested routes */}
          <Route path="/dashboard" element={
            <Wrapper>
              <Dashboard />
            </Wrapper>
          }
          >
          </Route>

          {/* Profile */}
          <Route path="/profile" element={
            <Wrapper>
              <Profile />
            </Wrapper>
          }
          ></Route>

          {/* Report form */}
          <Route path="/report" element={
            <Wrapper>
              <ReportForm />
            </Wrapper>
          }
          ></Route>


          {/* History */}
          <Route path="/history" element={
            <Wrapper>
              <History />
            </Wrapper>
          }
          ></Route>






        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
