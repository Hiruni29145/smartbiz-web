

import { useState } from "react"
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
} from "@mui/material"
import {
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
} from "@mui/icons-material"

const navigationItems = [
  { text: "Users", icon: People },
  { text: "Businesses", icon: Business },
  { text: "Employees", icon: Badge },
  { text: "Customers", icon: Group },
  { text: "Suppliers", icon: LocalShipping },
  { text: "Categories", icon: Category },
  { text: "Items", icon: Inventory },
  { text: "Orders", icon: ShoppingCart },
  { text: "Stock", icon: Assessment },
]

const DashboardSidebar = ({ mobileOpen, setMobileOpen }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [selectedItem, setSelectedItem] = useState("Users")

  const drawerWidth = 280

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#164e63",
        color: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
          variant="h5"
          sx={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            color: "white",
          }}
        >
          SmartBiz
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List
        sx={{
          px: 2,
          py: 2,
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isSelected = selectedItem === item.text

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setSelectedItem(item.text)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: isSelected ? "rgba(255,255,255,0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: "var(--font-source-sans)",
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default DashboardSidebar
