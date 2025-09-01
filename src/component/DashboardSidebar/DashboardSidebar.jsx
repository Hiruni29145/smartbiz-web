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

const drawerWidth = 280;

// Explicit paths that match your app routes
const navigationItems = [
  { label: "Home", icon: HomeIcon, to: "/home" },
  { label: "Users", icon: People, to: "/userpage" }, // matches <Route path="/userpage" />
  { label: "Businesses", icon: Business, to: "/businesses" },
  { label: "Employees", icon: Badge, to: "/employees" },
  { label: "Customers", icon: Group, to: "/customers" },
  { label: "Suppliers", icon: LocalShipping, to: "/suppliers" },
  { label: "Categories", icon: Category, to: "/categories" },
  { label: "Items", icon: Inventory, to: "/items" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Stock", icon: Assessment, to: "/stock" },
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
        overflow: "hidden", // prevent scroll inside drawer content
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
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
          variant="h5"
          sx={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
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
          overflow: "hidden", // no X/Y scroll in the list
        }}
      >
        {navigationItems.map(({ label, icon: Icon, to }) => (
          <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "& .MuiListItemText-primary": { fontWeight: 600 },
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  // remove translate to avoid horizontal overflow/scroll
                  // transform: "translateX(4px)",
                  pl: 2.5, // subtle nudge without causing overflow
                },
                transition: "background-color 0.3s ease, padding-left 0.3s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontFamily: "var(--font-source-sans)",
                  fontSize: "0.95rem",
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
          sx: {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            overflow: "hidden",        // remove both X and Y scrollbars
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
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
          sx: {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            overflow: "hidden",        // remove both X and Y scrollbars
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;