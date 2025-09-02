import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Home as HomeIcon,
  People,
  Business,
  Badge,
  Group,
  LocalShipping,
  Category,
  Inventory,
  ShoppingCart,
  Assessment,
  Close,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navigationItems = [
  { label: "Home", icon: HomeIcon, to: "/home" },
  { label: "Users", icon: People, to: "/userpage" },
  { label: "Businesses", icon: Business, to: "/businesses" },
  { label: "Employees", icon: Badge, to: "/employees" },
  { label: "Customers", icon: Group, to: "/customers" },
  { label: "Suppliers", icon: LocalShipping, to: "/suppliers" },
  { label: "Categories", icon: Category, to: "/categories" },
  { label: "Items", icon: Inventory, to: "/items" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Stock", icon: Assessment, to: "/stock" }, // ✅ Stock now always visible
];

const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const closeMobile = () => {
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#164e63",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Typography
          component={NavLink}
          to="/home"
          variant="h6"
          sx={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
            fontSize: "1rem",
          }}
        >
          SmartBiz
        </Typography>
        {isMobile && (
          <IconButton onClick={closeMobile} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          overflowY: "hidden", // 🚀 no scrolling needed unless on very small screen
          p: 0.5,
        }}
      >
        {navigationItems.map(({ label, icon: Icon, to }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              component={NavLink}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              sx={{
                borderRadius: 1.2,
                py: 1.6, // smaller padding
                px: 1.7,
                minHeight: 50, // tighter row
                color: "white",
                "& .MuiListItemIcon-root": { color: "white", minWidth: 32 },
                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  "& .MuiListItemText-primary": { fontWeight: 800 },
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  pl: 2,
                },
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontFamily: "var(--font-source-sans)",
                  fontSize: "0.92rem", // compact font
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: { boxSizing: "border-box", width: drawerWidth, border: "none" },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: "none", md: "block" } }}
        PaperProps={{
          sx: { boxSizing: "border-box", width: drawerWidth, border: "none" },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;
