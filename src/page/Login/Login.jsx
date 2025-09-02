import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { Email, Lock, Visibility, VisibilityOff, Business } from "@mui/icons-material"

// IMPORTANT: Make sure your Login component accepts the onLogin prop
const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.body.style.height = "100vh"
    document.documentElement.style.height = "100vh"

    return () => {
      document.body.style.overflow = "unset"
      document.documentElement.style.overflow = "unset"
      document.body.style.height = "auto"
      document.documentElement.style.height = "auto"
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Login attempt:", formData)
      
      // Basic validation
      if (!formData.email || !formData.password) {
        alert("Please enter both email and password")
        setIsLoading(false)
        return
      }

      // IMPORTANT: Call the onLogin function passed from App.jsx
      console.log("Calling onLogin with:", formData)
      onLogin(formData)
      
      setIsLoading(false)
    }, 2000)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    navigate("/register")
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3 },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Card
          elevation={16}
          sx={{
            borderRadius: 3,
            overflow: "visible",
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.98)",
            width: "100%",
            maxWidth: { xs: "100%", sm: 400 },
            mx: "auto",
            border: "1px solid rgba(37, 99, 235, 0.1)",
            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 3, sm: 4 },
              "&:last-child": { paddingBottom: { xs: 3, sm: 4 } },
            }}
          >
            {/* Logo and Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 56, sm: 64 },
                  height: { xs: 56, sm: 64 },
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  marginBottom: 2,
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                }}
              >
                <Business sx={{ fontSize: { xs: 28, sm: 32 }, color: "white" }} />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: "#1e293b",
                  marginBottom: 1,
                  textAlign: "center",
                }}
              >
                Welcome Back to SmartBiz
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "var(--font-inter)",
                  textAlign: "center",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  color: "#64748b",
                  fontWeight: 400,
                }}
              >
                Log in to access your business insights
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#64748b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontFamily: "var(--font-inter)",
                    "&:hover fieldset": {
                      borderColor: "#2563eb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "var(--font-inter)",
                    "&.Mui-focused": {
                      color: "#2563eb",
                    },
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#64748b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        aria-label="toggle password visibility"
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#2563eb" },
                        }}
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontFamily: "var(--font-inter)",
                    "&:hover fieldset": {
                      borderColor: "#2563eb",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb",
                      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "var(--font-inter)",
                    "&.Mui-focused": {
                      color: "#2563eb",
                    },
                  },
                }}
              />

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  marginBottom: 2,
                  padding: "12px 0",
                  borderRadius: 2,
                  backgroundColor: "#2563eb",
                  fontFamily: "var(--font-inter)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
                    transform: "translateY(-1px) scale(1.02)",
                  },
                  "&:disabled": {
                    backgroundColor: "#94a3b8",
                    boxShadow: "none",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    <span>Logging in...</span>
                  </Box>
                ) : (
                  "Log In"
                )}
              </Button>

              {/* Links */}
              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontFamily: "var(--font-inter)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "#1d4ed8",
                    },
                    transition: "color 0.2s ease-in-out",
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              {/* Register Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    href="#"
                    onClick={handleRegisterClick}
                    sx={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                        color: "#1d4ed8",
                      },
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default Login