import { Card, CardContent, Typography, Box, IconButton } from "@mui/material"
import { TrendingUp, TrendingDown } from "@mui/icons-material"

const KPICard = ({ title, value, subtitle, trend, icon: Icon, color = "#164e63" }) => {
  const isPositiveTrend = trend > 0

  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(22, 78, 99, 0.15)",
        },
        borderRadius: 2,
        background: "linear-gradient(135deg, #ffffff 0%, #ecfeff 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                color: "#164e63",
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "var(--font-source-sans)",
                color: "#475569",
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
          {Icon && (
            <IconButton
              sx={{
                backgroundColor: `${color}15`,
                color: color,
                "&:hover": { backgroundColor: `${color}25` },
              }}
            >
              <Icon />
            </IconButton>
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            color: "#164e63",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          {value}
        </Typography>

        {trend !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {isPositiveTrend ? (
              <TrendingUp sx={{ color: "#10b981", fontSize: 16 }} />
            ) : (
              <TrendingDown sx={{ color: "#ef4444", fontSize: 16 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                fontFamily: "var(--font-source-sans)",
                color: isPositiveTrend ? "#10b981" : "#ef4444",
                fontWeight: 500,
              }}
            >
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default KPICard
