import FlightIcon from "@mui/icons-material/Flight";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, Grid, Typography } from "@mui/material";

const VisaAftarSearchNav = () => {
  return (
    <Box
      px={2}
      py={0.1}
      my={2}
      sx={{ bgcolor: "#FFFFFF", height: "54px", borderRadius: "3px" }}
    >
      <Grid container columnSpacing={6}>
        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "54px",
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: "14px", color: "#141E22", fontWeight: 500 }}
              >
                Dhaka, Bangladesh
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: "12px",
                  color: "#8F8F98",
                  fontWeight: 500,
                }}
              >
                Hazrat shajalal Int Airport
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FlightIcon
                sx={{
                  transform: "rotate(90deg)",
                  color: "var(--secondary-color)",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: "14px", color: "#141E22", fontWeight: 500 }}
              >
                Dhaka, Bangladesh
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: "12px",
                  color: "#8F8F98",
                  fontWeight: 500,
                }}
              >
                Hazrat shajalal Int Airport
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "54px",
            }}
          >
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: "14px", color: "#141E22", fontWeight: 500 }}
              >
                Departure
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: "12px",
                  color: "#8F8F98",
                  fontWeight: 500,
                }}
              >
                Sun, 3rd june 2022
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "21px",
                  height: "21px",
                  bgcolor: "var(--error-bg-color)",
                  borderRadius: "2px",
                }}
              >
                <ArrowBackIosIcon
                  sx={{
                    fontSize: "16px",
                    color: "var(--primary-color)",
                    ml: "6px",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "var(--error-bg-color)",
                  width: "21px",
                  height: "21px",
                  borderRadius: "2px",
                }}
              >
                <ArrowForwardIosIcon
                  sx={{
                    fontSize: "16px",
                    fill: "var(--primary-color)",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: "14px", color: "#141E22", fontWeight: 500 }}
              >
                Trabelers & Class
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: "12px",
                  color: "#8F8F98",
                  fontWeight: 500,
                }}
              >
                1 Adult, Economy
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              height: "54px",
              gap: 1,
            }}
          >
            <Box>
              <Button
                sx={{
                  bgcolor: "var(--secondary-color)",
                  textTransform: "uppercase",
                  color: "white",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "var(--secondary-color)",
                  },
                }}
              >
                cm%
              </Button>
            </Box>
            <Box>
              <Button
                sx={{
                  bgcolor: "var(--primary-color)",
                  color: "white",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "var(--primary-color)",
                  },
                }}
              >
                Modify Search
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisaAftarSearchNav;
