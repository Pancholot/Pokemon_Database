import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import LoginScreen from "./components/LoginScreen/LoginScreen.tsx";
import Home from "./components/Home/Home.tsx";
import Register from "./components/RegisterScreen/Register.tsx";
import CaptureScreen from "./components/CaptureScreen/CaptureScreen.tsx";
import ProfileScreen from "./components/ProfileScreen/ProfileScreen.tsx";
import TeamScreen from "./components/ProfileScreen/TeamScreen.tsx";
import FriendScreen from "./components/FriendScreen/FriendScreen.tsx";
import TradesScreen from "./components/TradesScreen/TradesScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<Register />} />
      <Route path="capturescreen" element={<CaptureScreen />} />
      <Route path="profilescreen" element={<ProfileScreen />} />
      <Route path="teamscreen" element={<TeamScreen />} />
      <Route path="friendscreen" element={<FriendScreen />} />
      <Route path="tradescreen" element={<TradesScreen />} />

    </Routes>
  </BrowserRouter>
);
