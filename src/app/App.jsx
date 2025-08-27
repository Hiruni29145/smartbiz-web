import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../page/Dashboard/Dashboard";
import Home from "../page/Home/Home";
import UserPage from "../page/UserPage/UserPage";
// import Login from "../page/Login/Login"; // optional

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Optional login route */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Dashboard layout with nested pages */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="userpage" element={<UserPage />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;