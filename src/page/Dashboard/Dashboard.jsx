import React, { useState } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { Menu, Logout } from "@mui/icons-material";
import DashboardSidebar from "../../component/DashboardSidebar/DashboardSidebar";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your pages

import Login from "../../page/Login/Login";
import UserPage from "../../page/UserPage/UserPage";
import Home from "../Home/Home";
// ...add more pages as needed

const Dashboard = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex", }}>
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          // height: "100vh",
          // overflowY: "auto",
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* AppBar */}
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" }, color: "#164e63" }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "#164e63" }}>
              SmartBiz Dashboard
            </Typography>
            <Button onClick={onLogout} startIcon={<Logout />} sx={{ color: "#164e63" }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Routes */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <Routes>
            <Route path="*" element={<Navigate to="/home" />} />
            <Route path="/userpage" element={<UserPage />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
