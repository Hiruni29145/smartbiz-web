import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../page/Dashboard/Dashboard";
import Home from "../page/Home/Home";
import UserPage from "../page/UserPage/UserPage";
import Business from "../page/Business/Business"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="userpage" element={<UserPage />} />
          <Route path="businesses" element={<Business />} /> 
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;