import React from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Admin from "./Pages/Admin";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
