import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../page/Dashboard/Dashboard";
import Home from "../page/Home/Home";
import UserPage from "../page/UserPage/UserPage";
import Business from "../page/Business/Business";
import Employee from "../page/Employee/Employee";
import Customer from "../page/Customer/Customer";
import Suppliers from "../page/Supplier/Supplier";
import Category from "../page/Categories/Categories";
import Items from "../page/Items/Items";
import Orders from "../page/Order/Order";
import Stock from "../page/Stock/Stock";
import Login from "../page/Login/Login";
import Register from "../page/Register/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (loginData) => {
    console.log("handleLogin called with:", loginData);
    console.log("Setting isAuthenticated to true");
    setIsAuthenticated(true);
  };

  const handleRegister = (registerData) => {
    console.log("handleRegister called with:", registerData);
    console.log("Setting isAuthenticated to true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log("handleLogout called");
    console.log("Setting isAuthenticated to false");
    setIsAuthenticated(false);
  };

  console.log("App render - isAuthenticated:", isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onRegister={handleRegister} />
            )
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="userpage" element={<UserPage />} />
          <Route path="businesses" element={<Business />} />
          <Route path="employees" element={<Employee />} />
          <Route path="customers" element={<Customer />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="categories" element={<Category />} />
          <Route path="items" element={<Items />} />
          <Route path="orders" element={<Orders />} />
          <Route path="stock" element={<Stock />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Catch all other routes */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;