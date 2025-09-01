import React, { useState } from "react";
import {
  Box, AppBar, Toolbar, IconButton, Typography, Button,
  useTheme, useMediaQuery
} from "@mui/material";
import { Menu, Logout } from "@mui/icons-material";
import DashboardSidebar from "../../component/DashboardSidebar/DashboardSidebar";
import { Outlet } from "react-router-dom";

const Dashboard = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex" }}>
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen((p) => !p)}
              sx={{ mr: 2, display: { md: "none" }, color: "#164e63" }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "#164e63" }}>
              SmartBiz Dashboard
            </Typography>
            <Button onClick={() => onLogout?.()} startIcon={<Logout />} sx={{ color: "#164e63" }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

       
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;