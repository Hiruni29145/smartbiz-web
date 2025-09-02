import React from "react";
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



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="userpage" element={<UserPage />} />
          <Route path="businesses" element={<Business />} /> 
          <Route path="employees" element={<Employee/>} />
          <Route path="customers" element={<Customer/>} />
          <Route path="suppliers" element={<Suppliers/>} />
         <Route path="categories" element={<Category/>} />
          <Route path="items" element={<Items/>} />
          <Route path="orders" element={<Orders/>} />
          <Route path="stock" element={<Stock/>} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;