
import React, { useState } from "react"
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import {
  Menu,
  People,
  ShoppingCart,
  AttachMoney,
  Business,
  Assessment,
  Inventory,
  TrendingUp,
  Analytics,
  AccountBalance,
  Logout,
  Speed,
  Notifications,
  Settings,
} from "@mui/icons-material"
import DashboardSidebar from "../../component/DashboardSidebar/DashboardSidebar"
import KPICard from "../../common/component/KPICard/KPICard"
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const kpiData = [
    { title: "Total Customers", value: "2,847", subtitle: "Active customer base", trend: 12.5, icon: People, color: "#164e63" },
    { title: "Total Orders", value: "1,429", subtitle: "Orders this month", trend: 8.2, icon: ShoppingCart, color: "#10b981" },
    { title: "Revenue", value: "$84,290", subtitle: "Monthly revenue", trend: 15.3, icon: AttachMoney, color: "#f59e0b" },
    { title: "Active Businesses", value: "156", subtitle: "Registered businesses", trend: 5.7, icon: Business, color: "#8b5cf6" },
    { title: "Stock Items", value: "3,247", subtitle: "Items in inventory", trend: -2.1, icon: Inventory, color: "#ef4444" },
    { title: "Performance Score", value: "94.2%", subtitle: "Overall efficiency", trend: 3.8, icon: Assessment, color: "#06b6d4" },
    { title: "Growth Rate", value: "23.4%", subtitle: "Monthly growth", trend: 7.2, icon: TrendingUp, color: "#059669" },
    { title: "Analytics Score", value: "87.6%", subtitle: "Data insights", trend: 4.1, icon: Analytics, color: "#dc2626" },
    { title: "Cash Flow", value: "$156,890", subtitle: "Current balance", trend: 9.3, icon: AccountBalance, color: "#7c3aed" },
  ]

  const quickActions = [
    { title: "Quick Actions", icon: Speed, description: "Access frequently used features and tools", color: "#3b82f6" },
    { title: "Recent Activity", icon: Notifications, description: "View latest updates and notifications", color: "#10b981" },
    { title: "System Status", icon: Settings, description: "Monitor system health and performance", color: "#f59e0b" },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box 
      sx={{ 
        display: "flex", 
        height: "100vh", 
        overflow: "hidden" // 🚀 Prevents overall page scrolling
      }}
    >
      {/* Sidebar */}
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          height: "100vh",
          overflowY: "auto", // 🚀 Only this scrolls
          backgroundColor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0,
            zIndex: 1,
          }}
        >
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
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                color: "#164e63",
                flexGrow: 1,
              }}
            >
              SmartBiz Performance Dashboard
            </Typography>
            <Button
              onClick={onLogout}
              startIcon={<Logout />}
              sx={{
                color: "#164e63",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          {/* Welcome Section */}
          <Box mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "var(--font-inter)",
                fontWeight: 700,
                color: "#164e63",
                mb: 1,
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
              }}
            >
              Welcome back to SmartBiz
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "var(--font-inter)",
                color: "#64748b",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                maxWidth: "600px",
              }}
            >
              Gain insights at a glance and make data-driven decisions effortlessly with your comprehensive business
              dashboard.
            </Typography>
          </Box>

          {/* KPI Cards Grid */}
          <Box mb={4}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                color: "#164e63",
                mb: 3,
              }}
            >
              Key Performance Indicators
            </Typography>
            <Grid container spacing={3}>
              {kpiData.map((kpi, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <KPICard {...kpi} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Quick Access Section */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                color: "#164e63",
                mb: 3,
              }}
            >
              Quick Access
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e2e8f0",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: `${action.color}15`,
                            mr: 2,
                          }}
                        >
                          <action.icon sx={{ color: action.color, fontSize: 24 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            color: "#164e63",
                          }}
                        >
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "var(--font-inter)",
                          color: "#64748b",
                          lineHeight: 1.6,
                        }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
