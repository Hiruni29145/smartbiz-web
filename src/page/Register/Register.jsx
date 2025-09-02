import React from "react"
import { useState } from "react"
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
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff, 
  Business, 
  Person,
  Phone 
} from "@mui/icons-material"

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Please agree to the terms and conditions"
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Registration attempt:", formData)
      setIsLoading(false)
      // Here you would typically handle successful registration
      alert("Registration successful!")
    }, 2000)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3 },
        boxSizing: "border-box",
        py: { xs: 3, sm: 4 }, // Add top/bottom padding for better spacing
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
            maxWidth: { xs: "100%", sm: 420 },
            mx: "auto",
            border: "1px solid rgba(37, 99, 235, 0.1)",
            boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
            my: { xs: 2, sm: 3 },
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
                Join SmartBiz
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
                Create your account to get started
              </Typography>
            </Box>

            {/* Registration Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <Box sx={{ 
                display: "flex", 
                gap: 2, 
                marginBottom: 2,
                flexDirection: { xs: "column", sm: "row" } // Stack on small screens
              }}>
                <TextField
                  fullWidth
                  name="firstName"
                  type="text"
                  label="First Name"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                <TextField
                  fullWidth
                  name="lastName"
                  type="text"
                  label="Last Name"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
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
              </Box>

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
                error={!!errors.email}
                helperText={errors.email}
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

              {/* Phone Field */}
              <TextField
                fullWidth
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "#64748b", fontSize: 20 }} />
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={!!errors.password}
                helperText={errors.password}
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

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#64748b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        aria-label="toggle confirm password visibility"
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#2563eb" },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
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

              {/* Terms and Conditions */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    sx={{
                      color: "#64748b",
                      "&.Mui-checked": {
                        color: "#2563eb",
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.9rem",
                      color: "#64748b",
                    }}
                  >
                    I agree to the{" "}
                    <Link
                      href="#"
                      sx={{
                        color: "#2563eb",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      sx={{
                        color: "#2563eb",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ 
                  marginBottom: 2,
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": {
                    lineHeight: 1.4,
                  }
                }}
              />

              {/* Terms Error */}
              {errors.agreeToTerms && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#d32f2f",
                    fontSize: "0.75rem",
                    marginTop: "-8px",
                    marginBottom: "16px",
                    display: "block",
                  }}
                >
                  {errors.agreeToTerms}
                </Typography>
              )}

              {/* Register Button */}
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
                    <span>Creating Account...</span>
                  </Box>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href="#"
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
                    Log in here
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

export default Register