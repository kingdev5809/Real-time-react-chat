import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import SetAvatar from "./components/SetAvatar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatForCompany from "./Chat/ChatForCompany";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/setAvatar" element={<SetAvatar />} /> */}
        <Route path="/" element={<ChatForCompany />} />
      </Routes>
    </BrowserRouter>
  );
}
