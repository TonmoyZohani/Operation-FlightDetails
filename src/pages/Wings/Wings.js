import { Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import International from "../../images/logo/international.png";
import Ladies from "../../images/logo/ladies.png";
import Trips from "../../images/logo/trips.png";
import Tech from "../../images/logo/tech.png";
import { Link } from "react-router-dom";

const Wings = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <Box
      sx={{
        mx: {
          xs: "1rem",
        },
      }}
    >
      <Box
        sx={{
          minHeight: "50vh",
          mb: "10rem",
        }}
      >
        <Typography sx={style.header}>
          <span style={{ fontWeight: 100 }}>OTHER </span> WINGS
        </Typography>
        <Box sx={{ px: 4, pt: 8 }}>
          <Grid container spacing={4}>
            {list?.map((logo, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Link to={logo?.href}>
                  <Box
                    sx={{
                      ...style.card,
                      border: index === 0 && "1px solid #D3D3D3",
                      ":hover": {
                        border: "1px solid #D3D3D3",
                      },
                    }}
                  >
                    <img src={logo?.icon} alt="logo" />
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

const style = {
  card: {
    borderRadius: "10px",
    height: "180px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: {
      xs: "2rem",
      md: "3.125rem",
    },
    fontWeight: 500,
    lineHeight: "3.125rem",
    my: {
      xs: "2rem",
      md: "4rem",
    },
    color: "var(--black)",
  },
};

const list = [
  {
    icon: International,
    href: "#",
  },

  {
    icon: Ladies,
    href: "#",
  },
  {
    icon: Trips,
    href: "#",
  },
  {
    icon: Tech,
    href: "#",
  },
];

export default Wings;
